import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './../assets/styles/_index.css';

import AppStarter from '@sportdigi/app-starter';
import { generateH2hBaseUrl } from '@sportdigi/h2h-url-generator';
import { createHttpApi } from '@sportdigi/http-api';
import { createProjectStyleName, initIframeInTarget } from '@sportdigi/utils';
import { generateBetslipListeners } from '../utils/betslip';
import App from './../app/App';
import { persistor, store } from './rootReducer';
import { MAINTENANCE_STATIC_CONTENT, VIEW_NAME, VIEW_TYPE } from '../utils/constants';

export class Starter extends AppStarter {
  constructor() {
    super(...arguments);

    this.skinnerInstance = null;
    this.styleTag = null;
    this.stylesAppliedFromCMS = false;
    this.maintenanceIframe = null;
  }

  async globalSettingsDidResolved() {
    await this.initMaintenance();
    if (this.maintenanceIframe) return null;

    // this.config.overrideBetaStylingForWebComponent = true;
    this.config.appViewName = VIEW_NAME;
    this.config.viewType = VIEW_TYPE;
    createHttpApi(this.config, err => {
      this.dispatchEvent('onHttpCallError', err);
    });

    await this.setPartnerConfig();

    generateBetslipListeners(this);

    this.addRTLClassToContainer();
    this.attachPartnersCss();
    this.attachStyles();
    this.generatePartnerSportServiceUrl('LiveScoreUrl', 'livescore');
    this.generatePartnerSportServiceUrl('StatsUrl', 'stats');
    await this.setupSourcesToDOM();
  }

  async initMaintenance() {
    if (!this.config.globalSettings?.publicApis?.HealthCheckUrlSocket) {
      return;
    }

    const systemRidParam = this.config.sportPartner ? `&systemRID=${this.config.sportPartner}` : '';
    const healthCheckUrl = `${this.config.globalSettings.publicApis.HealthCheckUrlSocket}${systemRidParam}`;

    this.socket = new WebSocket(healthCheckUrl);

    this.socket.onmessage = async event => {
      const isMaintenanceAvailable = event.data;

      if (isMaintenanceAvailable !== 'false') {
        let container = this.config.shadowRoot || document.getElementById(this.config.containerId);

        if (!this.maintenanceIframe && container) {
          const iframeUrl = `${this.config.server}${MAINTENANCE_STATIC_CONTENT}`;
          this.maintenanceIframe = await initIframeInTarget(this, iframeUrl);
          container.appendChild(this.maintenanceIframe);
          this.target.remove();
          this.destroy();
        }
      } else if (this.maintenanceIframe) {
        this.maintenanceIframe.remove();
        this.maintenanceIframe = null;
        location.reload();
      }
    };

    this.socket.onerror = function (error) {
      console.log(error);
    };
  }

  async setPartnerConfig() {
    const partnerId = this.config.globalSettings.partner.Id;

    let config = await import(`../partners/${partnerId}/config.js`).catch(() => {});

    if (config) {
      const { ...partnerConfigs } = config;
      this.config.globalSettings.partner = { ...this.config.globalSettings.partner, ...partnerConfigs };
    }
  }

  addRTLClassToContainer() {
    if (!this.config.globalSettings.language.IsRTL) {
      return;
    }

    this.config.target.classList.add('dg_rtl');
  }

  attachLink(projectTheme) {
    const {
      globalSettings: {
        partner: { CdnDomainName, Env, Uuid },
      },
      shadowRoot,
      modalRoot,
      betslipRoot,
    } = this.config;

    const appName = this.appName.replace('View', '');
    const skinningStyleName = createProjectStyleName(appName, projectTheme);
    const skinningUrl = `https://${CdnDomainName}/skinning/${Env}/${Uuid}/${skinningStyleName}`;
    const container = shadowRoot || document.head;

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.href = skinningUrl;
      link.rel = 'stylesheet';
      link.onload = resolve;
      link.onerror = reject;

      //TODO must change this part for web components
      container.appendChild(link);

      if (modalRoot) {
        modalRoot.shadowRoot.append(link.cloneNode(true));
      }
      if (betslipRoot) {
        betslipRoot.shadowRoot.append(link.cloneNode(true));
      }
    });
  }

  attachStyles() {
    const { partner, language } = this.config.globalSettings;
    const domain = `https://${partner.CdnDomainName}/`;
    const templateFont = document.createElement('div');
    const cacheControl = Math.round(new Date().getHours() / 8);
    templateFont.style.display = 'none';
    const isFarsi = language.Name === 'fa-IR';
    const isArmenian = language.TwoLetterName === 'hy';

    templateFont.innerHTML = `
      <link href="${domain}assets/fonts/sport-ui-icons/style.css?v${cacheControl}" rel="stylesheet">
      <link href="${domain}assets/sprites/tournament/tournament.css?v${cacheControl}" rel="stylesheet">
      <link href="${domain}assets/sprites/country/style.css?v${cacheControl}" rel="stylesheet">
      ${isFarsi ? `<link href="${domain}assets/fonts/iransans/style.css?v${cacheControl}" rel="stylesheet">` : ''}
      ${isArmenian ? `<link href="${domain}assets/fonts/roboto/style.css?v${cacheControl}" rel="stylesheet">` : ''}
    `;

    document.head.append(templateFont);

    let templateContent = templateFont.cloneNode(true);
    this.config.shadowRoot.appendChild(templateContent);

    const { modalRoot, betslipRoot } = this.config;
    if (modalRoot) {
      modalRoot.shadowRoot.append(templateFont.cloneNode(true));
    }
    if (betslipRoot) {
      betslipRoot.shadowRoot.append(templateFont.cloneNode(true));
    }
  }

  attachBetslipStyles() {
    const {
      globalSettings: {
        partner: { Id, CdnDomainName },
      },
      shadowRoot,
      betslipRoot,
    } = this.config;
    const skinningUrl = `https://${CdnDomainName}/skinning/betslip/${Id}.css`;
    const container = shadowRoot;
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.href = skinningUrl;
      link.rel = 'stylesheet';
      link.onload = resolve;
      link.onerror = reject;
      console.log('link', link);

      container.appendChild(link);
      if (betslipRoot) {
        betslipRoot.shadowRoot.append(link.cloneNode(true));
      }
    });
  }

  async attachPartnersCss(projectThemeFromOutside) {
    const { globalSettings, projectTheme, externalCSSvariables } = this.config;

    let partnerId = externalCSSvariables ? '00001' : globalSettings.partner.Id;
    const projectThemeFinely = projectThemeFromOutside ? projectThemeFromOutside : projectTheme;

    try {
      await this.attachLink(projectThemeFinely);
    } catch (error) {
      await import(`../assets/styles/partners/${partnerId}/Styles/web.css`).catch(e => console.log(e.message));
      try {
        await this.attachBetslipStyles();
      } catch (e) {
        console.error(e);
      }
    }
  }

  generatePartnerSportServiceUrl(key, subDomain) {
    const partnerSettings = this.config.globalSettings.partner;
    let language = this.config.globalSettings.language;

    partnerSettings[key] = generateH2hBaseUrl({
      baseUrl: partnerSettings[key],
      partnerUuId: partnerSettings.Uuid,
      subDomain,
      provider: partnerSettings['LiveScoreStatsProvider'],
      languageCode: language.TwoLetterName || 'en',
    });
  }

  async applyExternalStyes() {
    const { externalCSSvariables } = this.config;

    if (externalCSSvariables) {
      if (!this.skinnerInstance) {
        const { Skinner } = await import('@sportdigi/skinner');
        this.skinnerInstance = new Skinner();
      }

      this.skinnerInstance.init(externalCSSvariables);

      if (this.skinnerInstance.initialized) {
        if (!this.styleTag) {
          const rootElement = document.head;
          this.styleTag = document.createElement('style');
          rootElement.appendChild(this.styleTag);
        }

        this.skinnerInstance.injectHtmlVars(this.styleTag);
      }
    }
  }

  async onColorsChange(colors) {
    if (this.stylesAppliedFromCMS) {
      return;
    }

    this.config['externalCSSvariables'] = colors;
    await this.applyExternalStyes();
  }

  async setupSourcesToDOM() {
    const name = 'dataLayer';
    window[name] = window[name] || [];
    window[name].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    window[name].push({ view_type: this.config.appViewName, partner_id: this.config.globalSettings.partner.Id });
    const url = 'https://www.googletagmanager.com/';
    const script = document.createElement('script');
    script.async = true;
    script.src = `${url}gtm.js?id=GTM-KXMVC3LP`;

    document.head.append(script);
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<iframe src='${url}ns.html?id=GTM-KXMVC3LP' height='0' width='0' style='display:none;visibility:hidden'></iframe>`;
    document.body.append(noscript);
  }

  render() {
    if (this.maintenanceIframe) return null;

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App starter={this} config={this.config} />
        </PersistGate>
      </Provider>
    );
  }
}
