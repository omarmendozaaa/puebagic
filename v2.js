import { CellsPage } from '@cells/cells-page';
import { html } from 'lit-element';
import '@cells-components/cells-template-paper-drawer-panel';
import styles from './dashboard-page-styles';

const components = {
  CORE: 'cells-commercial-portal-core',
  HEADER: 'cells-header-portal',
  TABBAR: 'cells-tab-bar',
  BODY: 'cells-body-main-portal',
  ERROR: 'cells-pgc-error-modal',
  ALERTS: 'cells-active-product-request-modal-pgc',
  CARD_ACTIVE: 'cells-card-active-modal',
  CARD_BLOCK: 'cells-card-block-modal',
  BIOMETRIC: 'cells-biometric-pass',
  SPINNER: 'cells-spinner-global-pgc',
  COMMUNICATION: 'cells-portal-communication-dm',
  INTEGRATOR: 'cells-integrator-app-pgc',
  PICPGC_DM: 'cells-picpgc-request-dm-pgc',
  PGC_DM: 'cells-pgc-dm',
  CONTACTCENTER: 'bbva-contact-center-gic'
};

class DashboardPage extends CellsPage {
  static get is() {
    return 'dashboard-page';
  }

  constructor() {
    super();
    this.headerLogo = './resources/images/logo_bbva_blanco.svg';
    this.config = window.AppConfig.config;
    this.ctts = window.AppConfig.ctts;
    this.isContactCenter = false;
  }

  static get properties() {
    return {
      config: { type: Object },
      ctts: { type: Object },
      headerLogo: { type: String },
      isContactCenter: { type: Boolean }
    };
  }

  onPageEnter() {
    console.log('onPageEnter');
    this.shadowRoot.querySelector(components.CORE)._config();
    let detail = { config: this.config, ctts: this.ctts };
    this.shadowRoot.querySelector(components.TABBAR)._config(detail);
    this.shadowRoot.querySelector(components.BODY)._config(detail);
    this.shadowRoot.querySelector(components.CARD_ACTIVE)._config(detail);
    this.shadowRoot.querySelector(components.CARD_BLOCK)._config(detail);
    this.shadowRoot.querySelector(components.BIOMETRIC)._config(detail);
    this.shadowRoot.querySelector(components.PICPGC_DM)._config(detail);
    this.shadowRoot.querySelector(components.PGC_DM)._config(detail);
    this.shadowRoot.querySelector(components.INTEGRATOR).initializeIntegrationParent();
    this.activePureCloud();
  }

  onPageLeave() {
    console.log('Page unloaded');
  }


  onLoginSuccess(event) {
    this.shadowRoot.querySelector(components.CORE)._launchApp(event.detail);
  }

  onSetUserData(event) {
    this.shadowRoot.querySelector(components.BODY).userData = event.detail;
    this.shadowRoot.querySelector(components.BIOMETRIC).userData = event.detail;
    this.shadowRoot.querySelector(components.CARD_BLOCK).userData = event.detail;
  }

  onAddItemTabbar(event) {
    this.shadowRoot.querySelector(components.TABBAR)._addItem(event.detail);
  }

  onFocusItemTabbar(event) {
    this.shadowRoot.querySelector(components.TABBAR)._focusItemRequest(event.detail);
  }

  onAddBodyPage(event) {
    this.shadowRoot.querySelector(components.BODY)._addFrame(event.detail);
  }

  onRemoveBodyPage(event) {
    this.shadowRoot.querySelector(components.BODY)._removeFrame(event.detail);
  }

  onFocusBodyPage(event) {
    this.shadowRoot.querySelector(components.BODY)._focusFrame(event.detail);
  }

  onShowErrorModal(event) {
    this.shadowRoot.querySelector(components.ERROR).show(event.detail);
  }

  onOpenAlertModal(event) {
    this.shadowRoot.querySelector(components.ALERTS).open(event.detail);
  }

  onShowSpinnerGlobal(event) {
    this.shadowRoot.querySelector(components.SPINNER).activeLoading(event.detail);
  }

  onOpenMenuOption(event) {
    this.shadowRoot.querySelector(components.CORE)._openMenuOption(event.detail);
  }

  onCloseMenuOption(event) {
    let idMenuOption = event.detail.id;
    this.shadowRoot.querySelector(components.TABBAR)._removeItem(idMenuOption);
  }

  onCardActivationRequest(event) {
    this.shadowRoot.querySelector(components.CARD_ACTIVE).open(event.detail);
  }

  onCardActivationResponse(event) {
    this.shadowRoot.querySelector(components.BODY).cardActivationResponse(event.detail);
  }

  onCardBlockRequest(event) {
    this.shadowRoot.querySelector(components.CARD_BLOCK).open(event.detail);
  }

  onCardBlockResponse(event) {
    this.shadowRoot.querySelector(components.BODY).cardBlockResponse(event.detail);
  }

  onBiometricRequest(event) {
    this.shadowRoot.querySelector(components.BIOMETRIC).open(event.detail);
  }

  onBiometricResponse(event) {
    this.shadowRoot.querySelector(components.CARD_ACTIVE).onBiometricResponse(event.detail);
    this.shadowRoot.querySelector(components.CARD_BLOCK).onBiometricResponse(event.detail);
    this.shadowRoot.querySelector(components.CORE).onBiometricResponseToApp(event.detail);
  }

  onBiometricCanceled(event) {
    this.shadowRoot.querySelector(components.CORE).onBiometricResponseToApp(event.detail);
  }

  onSendRequestDm(event) {
    this.shadowRoot.querySelector(components.PGC_DM).sendRequest(event.detail);
  }

  onPICPGCRestRequest(event) {
    this.shadowRoot.querySelector(components.PICPGC_DM).newRestRequest(event.detail);
  }

  onNewTsecRequest(event) {
    this.shadowRoot.querySelector(components.CORE)._newTsecRequest(event.detail);
  }

  onSendMessageDM(event) {
    this.shadowRoot.querySelector(components.COMMUNICATION)._sendMessage(event.detail);
  }

  onNewTsecResponseDM(event) {
    this.shadowRoot.querySelector(components.CORE)._newTsecResponse(event.detail);
  }

  onNewTsecResponse(event) {
    this.shadowRoot.querySelector(components.PGC_DM).reloadRequest(event.detail);
    this.shadowRoot.querySelector(components.PICPGC_DM).reloadRestRequest(event.detail);
    this.shadowRoot.querySelector(components.INTEGRATOR).messageParentResponseChildren(event.detail);
  }

  onPICPGCRestResponseDM(event) {
    this.shadowRoot.querySelector(components.PICPGC_DM).newRestResponse(event.detail);
  }

  onAppDataRequest(event) {
    this.shadowRoot.querySelector(components.BODY).appDataRequest(event.detail);
  }

  onAppFocusRequest(event) {
    this.shadowRoot.querySelector(components.CORE).appFocusRequest(event.detail);
  }

  onAppActionRequest(event) {
    this.shadowRoot.querySelector(components.CORE).appActionRequest(event.detail);
  }

  onAppActionResponse(event) {
    this.shadowRoot.querySelector(components.CORE).appActionResponse(event.detail);
  }

  onOpenPDFViewwer(event) {
    this.shadowRoot.querySelector(components.CORE).openPdfViewer(event.detail);
  }

  closeAlert() {
    this.shadowRoot.querySelector(components.ALERTS).close();
  }

  onCallSwitchChanged(event) {
    if (event.detail === true) {
      this.authPureCloud();
      this.isContactCenter = true;
    } else {      
      this.isContactCenter = false;
    }
  }

  authPureCloud(){
    const {hash} = window.location;
      if (!hash && !this.isValidToken()) {
          window.location.replace(`https://login.${window.AppConfig.environment}/oauth/authorize?response_type=token&client_id=${window.AppConfig.clientId}&redirect_uri=${window.AppConfig.redirectUri}&org=${window.AppConfig.org}`);
          return;
      } 
  }

  isValidToken(){
    const token = sessionStorage.getItem('bccdp_access_token');
    const expires = sessionStorage.getItem('bccdp_expires');
    return token && Date.now() <= expires;
  }

  activePureCloud(){
    if(this.isValidToken()){
      this.isContactCenter = true;
      this.shadowRoot.querySelector(components.TABBAR).changeCallSwitchStatus(true);
    }
  }

  render() {
    return html`
    <style>${this.constructor.shadyStyles}</style>
    <cells-template-paper-drawer-panel mode="seamed" header-hidden="true">

      <div slot="app__main" class="container">
        <cells-tab-bar 
          @show-error-modal="${this.onShowErrorModal}" 
          @open-alert-modal="${this.onOpenAlertModal}" 
          @close-alert-modal="${this.closeAlert}"
          @spinner-global-event="${this.onShowSpinnerGlobal}"
          @add-body-page="${this.onAddBodyPage}"
          @remove-body-page="${this.onRemoveBodyPage}"
          @focus-body-page="${this.onFocusBodyPage}"
          @call-switch-changed="${this.onCallSwitchChanged}">
        </cells-tab-bar>
        <cells-body-main-portal
          @show-error-modal="${this.onShowErrorModal}" 
          @open-alert-modal="${this.onOpenAlertModal}" 
          @close-alert-modal="${this.closeAlert}"
          @spinner-global-event="${this.onShowSpinnerGlobal}"
          @card-activation-request="${this.onCardActivationRequest}"
          @card-block-request="${this.onCardBlockRequest}"
          @send-request-dm="${this.onSendRequestDm}"
          @picpgc-rest-request="${this.onPICPGCRestRequest}"
          @send-message-dm="${this.onSendMessageDM}"
          @open-pdf-viewer="${this.onOpenPDFViewwer}">
        </cells-body-main-portal>
        <cells-card-active-modal
          @show-error-modal="${this.onShowErrorModal}" 
          @open-alert-modal="${this.onOpenAlertModal}" 
          @close-alert-modal="${this.closeAlert}"
          @spinner-global-event="${this.onShowSpinnerGlobal}"
          @biometric-request="${this.onBiometricRequest}"
          @card-activation-response="${this.onCardActivationResponse}"
          @send-request-dm="${this.onSendRequestDm}"
          @picpgc-rest-request="${this.onPICPGCRestRequest}">
        </cells-card-active-modal>
        <cells-card-block-modal
          @show-error-modal="${this.onShowErrorModal}"
          @open-alert-modal="${this.onOpenAlertModal}" 
          @close-alert-modal="${this.closeAlert}"
          @spinner-global-event="${this.onShowSpinnerGlobal}"
          @biometric-request="${this.onBiometricRequest}"
          @card-block-response="${this.onCardBlockResponse}"
          @send-request-dm="${this.onSendRequestDm}"
          @picpgc-rest-request="${this.onPICPGCRestRequest}">
        </cells-card-block-modal>
        <cells-biometric-pass
          @show-error-modal="${this.onShowErrorModal}" 
          @open-alert-modal="${this.onOpenAlertModal}"
          @close-alert-modal="${this.closeAlert}" 
          @spinner-global-event="${this.onShowSpinnerGlobal}"
          @send-request-dm="${this.onSendRequestDm}"
          @picpgc-rest-request="${this.onPICPGCRestRequest}"
          @biometric-response="${this.onBiometricResponse}"
          @biometric-canceled="${this.onBiometricCanceled}">
        </cells-biometric-pass>
        ${ this.isContactCenter ? html `<bbva-contact-center-gic environment="mypurecloud.com" open-icon-src="resources/images/bcc_logo.svg" tool-icon-src="resources/images/tools.svg" has-token>
      </bbva-contact-center-gic>` : html `` }
      </div>
      
      <div slot="app__transactional">
        <cells-commercial-portal-core
          @show-error-modal="${this.onShowErrorModal}" 
          @open-alert-modal="${this.onOpenAlertModal}"
          @close-alert-modal="${this.closeAlert}"
          @spinner-global-event="${this.onShowSpinnerGlobal}"
          @set-user-data="${this.onSetUserData}"
          @add-item-tabbar="${this.onAddItemTabbar}"
          @send-message-dm="${this.onSendMessageDM}"
          @new-tsec-response="${this.onNewTsecResponse}"
          @focus-item-tabbar="${this.onFocusItemTabbar}">
        </cells-commercial-portal-core>
        <cells-portal-communication-dm
          @show-error-modal="${this.onShowErrorModal}" 
          @open-alert-modal="${this.onOpenAlertModal}" 
          @close-alert-modal="${this.closeAlert}"
          @spinner-global-event="${this.onShowSpinnerGlobal}"
          @login-success="${this.onLoginSuccess}"
          @open-menu-option="${this.onOpenMenuOption}"
          @close-menu-option="${this.onCloseMenuOption}"
          @new-tsec-request="${this.onNewTsecRequest}"
          @new-tsec-response="${this.onNewTsecResponseDM}"
          @picpgc-rest-response="${this.onPICPGCRestResponseDM}"
          @app-data-request="${this.onAppDataRequest}"
          @app-focus-request="${this.onAppFocusRequest}"
          @app-action-request="${this.onAppActionRequest}"
          @app-action-response="${this.onAppActionResponse}"
          @biometric-request="${this.onBiometricRequest}">
        </cells-portal-communication-dm>
        <cells-integrator-app-pgc
          @show-error-modal="${this.onShowErrorModal}" 
          @open-alert-modal="${this.onOpenAlertModal}" 
          @close-alert-modal="${this.closeAlert}"
          @spinner-global-event="${this.onShowSpinnerGlobal}"
          @new-tsec-request="${this.onNewTsecRequest}">
        </cells-integrator-app-pgc>
        <cells-picpgc-request-dm-pgc
          @show-error-modal="${this.onShowErrorModal}" 
          @open-alert-modal="${this.onOpenAlertModal}" 
          @close-alert-modal="${this.closeAlert}"
          @spinner-global-event="${this.onShowSpinnerGlobal}"
          @send-message-dm="${this.onSendMessageDM}"
          @new-tsec-request="${this.onNewTsecRequest}">
        </cells-picpgc-request-dm-pgc>
        <cells-pgc-dm
          @show-error-modal="${this.onShowErrorModal}" 
          @open-alert-modal="${this.onOpenAlertModal}" 
          @close-alert-modal="${this.closeAlert}"
          @spinner-global-event="${this.onShowSpinnerGlobal}"
          @new-tsec-request="${this.onNewTsecRequest}">
        </cells-pgc-dm>
      </div>

      <div slot="app__overlay">
        <cells-spinner-global-pgc></cells-spinner-global-pgc>
        <cells-pgc-error-modal></cells-pgc-error-modal>
        <cells-active-product-request-modal-pgc></cells-active-product-request-modal-pgc>
      </div>

    </cells-template-paper-drawer-panel>`;
  }

  static get shadyStyles() {
    return `
      ${styles.cssText}
    `;
  }
}

window.customElements.define(DashboardPage.is, DashboardPage);
