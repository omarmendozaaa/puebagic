import { CellsPage } from '@cells/cells-page';
import { html } from 'lit-element';
import '@cells-components/cells-template-paper-drawer-panel';
import '@cells-pgc/cells-purecloud-handler-pgc';
import styles from './dashboard-page-styles';

const components = {
  CORE: 'cells-commercial-portal-core',
  HEADER: 'cells-header-portal',
  TABBAR: 'cells-tab-bar',
  BODY: 'cells-body-main-portal',
  ERROR: 'cells-pgc-error-modal',
  ALERTS: 'cells-alerts-pgc',
  CARD_ACTIVE: 'cells-card-active-modal',
  CARD_BLOCK: 'cells-card-block-modal',
  BIOMETRIC: 'cells-biometric-pass',
  SPINNER: 'cells-spinner-global-pgc',
  COMMUNICATION: 'cells-portal-communication-dm',
  INTEGRATOR: 'cells-integrator-app-pgc',
  PICPGC_DM: 'cells-picpgc-request-dm-pgc',
  PGC_DM: '',
  PURECLOUD: 'cells-purecloud-handler-pgc',
  CONTACTCENTER: 'bbva-contact-center-gic'
};

class DashboardPage extends CellsPage {
  static get is() {
    return 'dashboard-page';
  }

  static get properties() {
    return {
      config: { type: Object },
      ctts: { type: Object },
      headerLogo: { type: String },
      customers: {
        type: Array,
      },
      customerDetail: {
        type: Object,
      },
      loading: {
        type: Boolean,
      }
    };
  }

  constructor() {
    super();
    this.headerLogo = './resources/images/logo_bbva_blanco.svg';
    this.config = window.AppConfig.config;
    this.ctts = window.AppConfig.ctts;
    Object.assign(this, {
      customers: [],
      customerDetail: {},
      loading: false,
    });

  }



  onPageEnter() {
    console.log('%conPageEnter:', 'background: #1973B8; color: #BFF8F8');

    const widget = this.shadowRoot.querySelector(components.CONTACTCENTER);
    console.log('onPageEnter ---> ',widget)
    this.publishOn('global_agent_info', widget, 'bbva-cc-gic-agent-info');
    this.publishOn('customer_info', widget, 'bbva-cc-gic-customer-info');
    this.publishOn('customer_disconnect', widget, 'bbva-cc-gic-customer-disconnect');
    this.publishOn('global_reload', widget, 'bbva-cc-gic-refresh-required');
    this.shadowRoot.querySelector(components.CORE)._config();
    let detail = { config: this.config, ctts: this.ctts };
    this.shadowRoot.querySelector(components.TABBAR)._config(detail);
    this.shadowRoot.querySelector(components.BODY)._config(detail);
    this.shadowRoot.querySelector(components.CARD_ACTIVE)._config(detail);
    this.shadowRoot.querySelector(components.CARD_BLOCK)._config(detail);
    this.shadowRoot.querySelector(components.BIOMETRIC)._config(detail);
    this.shadowRoot.querySelector(components.PICPGC_DM)._config(detail);
    //this.shadowRoot.querySelector(components.PGC_DM)._config(detail);
    this.shadowRoot.querySelector(components.PURECLOUD)._config(detail);
    this.shadowRoot.querySelector(components.INTEGRATOR).initializeIntegrationParent();

    console.log('onPageEnter before active pure cloud',sessionStorage.getItem('bccdp_access_token'))
    this.activePureCloud();

  }

    onPageLeave() {
        console.log('Page unloaded');
    }

  connectedCallback() {
    console.log('%cconnectedCallback: ', 'background: #005454; color: #BFF8F8');
    let cont = 0;

    super.connectedCallback();
    this.subscribe('customer_info', customer => {
      console.log(cont+1);
      const {customers} = this;
      const index = customers.findIndex(c => c.id === customer.id);
      if (index === -1) {
        this.customers = customers.concat(customer);
      }
      this.getCustomerDetail(customer);
    });
    this.subscribe('customer_disconnect', customer => {
      const {customers} = this;
      const index = customers.findIndex(c => c.id === customer.id);
      if (index !== -1) {
        customers.splice(index, 1);
        this.customers = customers;
      }
      this.customerDetail = {};
      this.requestUpdate();
    });
  }
    async onLoginSuccess(event) {
      const token = this.shadowRoot.querySelector(components.PURECLOUD).token;
      sessionStorage.setItem('bccdp_access_token', token);
      await this.shadowRoot.querySelector(components.CONTACTCENTER)._init()
      //sessionStorage.setItem('bccdp_expires', Date.now() + (Math.abs(expiresIn) * 1000));
      //this.shadowRoot.querySelector(components.CORE)._launchApp(event.detail);
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

    onRemoveItemTabbar(event) {
        this.shadowRoot.querySelector(components.TABBAR)._removeItemRequest(event.detail);
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

    onCallSwitchChanged(event) {

      // if (event.detail === true) {
      //   this.authPureCloud();
      //   this.isContactCenter = true;
      // } else {
      //   this.isContactCenter = false;
      // }

      if (event.detail === true) {
        this.shadowRoot.querySelector(components.PURECLOUD).login(event.detail);
      } else {
        this.shadowRoot.querySelector(components.PURECLOUD).logout(event.detail);
        this.shadowRoot.querySelector(components.CONTACTCENTER).isReady = false;
      }
    }

    onPureCloudCallConnected(event) {
      this.shadowRoot.querySelector(components.CORE).callConnectedHandler(event.detail);
    }

    onPureCloudCallDisconnected(event) {
      this.shadowRoot.querySelector(components.CORE).callDisconnectedHandler(event.detail);
    }
    onPureCloudOAuthCancel(event) {
      this.shadowRoot.querySelector(components.TABBAR).changeCallSwitchStatus(false);
    }

    onPureCloudOAuthLogout(event) {
      sessionStorage.clear('bccdp_access_token')
      this.shadowRoot.querySelector(components.CONTACTCENTER).isReady = false;
    }

    onPureCloudOAuthFail(event) {
      this.shadowRoot.querySelector(components.TABBAR).changeCallSwitchStatus(false);
      this.shadowRoot.querySelector(components.ERROR).show(event.detail);
    }

    onPureCloudOAuthSuccess(event) {
      this.shadowRoot.querySelector(components.ALERTS).open({
        title: 'Conexión a PureCloud',
        message: 'Conexión realizada con éxito',
        type: this.ctts.alerts.type.SUCCESS,
        btnAcept: true
      });
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
      //const expires = sessionStorage.getItem('bccdp_expires');
      //return token && Date.now() <= expires;
      return token
    }

    activePureCloud(){
      console.log('Active Pure Cloud',sessionStorage.getItem('bccdp_access_token'))
      if(this.isValidToken()){
        console.log('Entra a activePureCloud 2')
        this.shadowRoot.querySelector(components.TABBAR).changeCallSwitchStatus(true);
      }
    }

    getCustomerDetail(customer) {
    console.log(`%cgetCustomerDetail:`, 'background: #1973C8; color: #BFF8F8');

    let conversationId = customer.id;
    let number = customer.address;
    let clientCode = customer.attributes.ClientCode;
    let pool = customer.attributes.ScreenPopName;
    console.log(`%cconversationId: ${conversationId} `, 'background: #1973B8; color: #BFF8F8');
    console.log(`%cnumber: ${number} `, 'background: #49A5E6; color: #BFF8F8');
    console.log(`%cclientCode: ${clientCode}  `, 'background: #D4EDFC; color: #1973B8');
    console.log(`%cpool: ${pool} `, 'background: #02A5A5; color: #BFF8F8');



      // let service = new BGADPCustomersCustomerGetV1({
    //   host: window.AppConfig.host,
    //   version: 1,
    //   requiredToken: window.AppConfig.requiredToken || 'jwt',
    //   params: {
    //     'customer-id': '123444',
    //   },
    //   htmlContext: this,
    // });
    this.loading = true;
    // service.generateRequest()
    //   .then(request => JSON.parse(request.response))
    //   .then(({data}) => {
    //     this.customerDetail = data;
    //   })
    //   .catch(error => console.warn(error))
    //   .finally(() => {
    //     this.loading = false;
    //   });
  }



    render() {
        return html `
    <style>${this.constructor.shadyStyles}</style>
    <cells-template-paper-drawer-panel mode="seamed" header-hidden="true">

      <div slot="app__main" class="container">
        <cells-tab-bar
          @show-error-modal="${this.onShowErrorModal}" @open-alert-modal="${this.onOpenAlertModal}" @spinner-global-event="${this.onShowSpinnerGlobal}"
          @add-body-page="${this.onAddBodyPage}"
          @remove-body-page="${this.onRemoveBodyPage}"
          @focus-body-page="${this.onFocusBodyPage}"
          @call-switch-changed="${this.onCallSwitchChanged}">
        </cells-tab-bar>
        <cells-body-main-portal
          @show-error-modal="${this.onShowErrorModal}" @open-alert-modal="${this.onOpenAlertModal}" @spinner-global-event="${this.onShowSpinnerGlobal}"
          @card-activation-request="${this.onCardActivationRequest}"
          @card-block-request="${this.onCardBlockRequest}"
          @send-request-dm="${this.onSendRequestDm}"
          @picpgc-rest-request="${this.onPICPGCRestRequest}"
          @send-message-dm="${this.onSendMessageDM}"
          @open-pdf-viewer="${this.onOpenPDFViewwer}">
        </cells-body-main-portal>
        <cells-card-active-modal
          @show-error-modal="${this.onShowErrorModal}" @open-alert-modal="${this.onOpenAlertModal}"
          @biometric-request="${this.onBiometricRequest}"
          @card-activation-response="${this.onCardActivationResponse}"
          @send-request-dm="${this.onSendRequestDm}">
        </cells-card-active-modal>
        <cells-card-block-modal
          @show-error-modal="${this.onShowErrorModal}" @open-alert-modal="${this.onOpenAlertModal}"
          @biometric-request="${this.onBiometricRequest}"
          @card-block-response="${this.onCardBlockResponse}"
          @send-request-dm="${this.onSendRequestDm}"
          @picpgc-rest-request="${this.onPICPGCRestRequest}">
        </cells-card-block-modal>
        <cells-biometric-pass
          @show-error-modal="${this.onShowErrorModal}" @open-alert-modal="${this.onOpenAlertModal}"
          @send-request-dm="${this.onSendRequestDm}"
          @picpgc-rest-request="${this.onPICPGCRestRequest}"
          @biometric-response="${this.onBiometricResponse}">
        </cells-biometric-pass>

      <bbva-contact-center-gic environment=${window.AppConfig.environment} open-icon-src="resources/images/bcc_logo.svg" tool-icon-src="resources/images/tools.svg" has-token>
      </bbva-contact-center-gic>


      </div>

      <div slot="app__transactional">
        <cells-commercial-portal-core
          @show-error-modal="${this.onShowErrorModal}" @open-alert-modal="${this.onOpenAlertModal}"
          @set-user-data="${this.onSetUserData}"
          @add-item-tabbar="${this.onAddItemTabbar}"
          @send-message-dm="${this.onSendMessageDM}"
          @new-tsec-response="${this.onNewTsecResponse}"
          @focus-item-tabbar="${this.onFocusItemTabbar}"
          @remove-item-tabbar="${this.onRemoveItemTabbar}"
          @send-request-dm="${this.onSendRequestDm}">
        </cells-commercial-portal-core>
        <cells-portal-communication-dm
          @show-error-modal="${this.onShowErrorModal}" @open-alert-modal="${this.onOpenAlertModal}"
          @login-success="${this.onLoginSuccess}"
          @open-menu-option="${this.onOpenMenuOption}"
          @new-tsec-request="${this.onNewTsecRequest}"
          @new-tsec-response="${this.onNewTsecResponseDM}"
          @picpgc-rest-response="${this.onPICPGCRestResponseDM}"
          @app-data-request="${this.onAppDataRequest}"
          @app-focus-request="${this.onAppFocusRequest}"
          @app-action-request="${this.onAppActionRequest}"
          @app-action-response="${this.onAppActionResponse}">
        </cells-portal-communication-dm>
        <cells-integrator-app-pgc
          @show-error-modal="${this.onShowErrorModal}" @open-alert-modal="${this.onOpenAlertModal}"
          @new-tsec-request="${this.onNewTsecRequest}">
        </cells-integrator-app-pgc>
        <cells-picpgc-request-dm-pgc
          @show-error-modal="${this.onShowErrorModal}" @open-alert-modal="${this.onOpenAlertModal}" @spinner-global-event="${this.onShowSpinnerGlobal}"
          @send-message-dm="${this.onSendMessageDM}"
          @new-tsec-request="${this.onNewTsecRequest}">
        </cells-picpgc-request-dm-pgc>
        <cells-pgc-dm
          @show-error-modal="${this.onShowErrorModal}" @open-alert-modal="${this.onOpenAlertModal}" @spinner-global-event="${this.onShowSpinnerGlobal}"
          @new-tsec-request="${this.onNewTsecRequest}">
        </cells-pgc-dm>



      </div>

      <div slot="app__overlay">
        <cells-spinner-global-pgc></cells-spinner-global-pgc>
        <cells-pgc-error-modal></cells-pgc-error-modal>
        <cells-alerts-pgc></cells-alerts-pgc>
        <cells-purecloud-handler-pgc
          @purecloud-oauth-success="${this.onLoginSuccess}"
          @purecloud-oauth-logout="${this.onPureCloudOAuthLogout}"
          >
        </cells-purecloud-handler-pgc>
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
