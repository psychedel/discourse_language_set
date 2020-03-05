import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";
import { ajax } from "discourse/lib/ajax";
function initialize(api) {
  const allow_user_locale = Discourse.SiteSettings.allow_user_locale;
  const currentUser = api.getCurrentUser();
  if(!allow_user_locale || !currentUser) return;
    
  
  var username = currentUser.get("username");

  api.createWidget("lang-list", {
    tagName: 'li.lang_list',
    

    html(attrs){
      return h("li",{className:"set_li select-kit-row",lang:attrs.value},attrs.name);
    },
    click(event){
       ajax("/u/" + username + ".json", {
            type: "PUT",
            data: {
              locale: this.attrs.value,
            }
            })
            .then((result) => {
              window.location.reload()
            })
            .catch(error => {
              if (error) {
              console.log(error)
              }
            })
            .finally(() => {});
    }

  })

  api.createWidget("lang-default", {
    tagName: 'div.lang_default',
    
    html(){
      return h("span.set_span","中文");
    },
    click(){
       
      this.sendWidgetAction("toggleLangList");
    }

  })

  api.createWidget("lang-list-div", {
    tagName: 'div.lang_list_div',
    
    html(attrs, state){
      var html = []
      const langs = JSON.parse(Discourse.SiteSettings.available_locales)
      langs.map(v =>{
        var item = this.attach('lang-list',v);
        html.push(item) 
      })
      return h("ul.select-kit-collection.set_ul.menu-panel",html);
   
    },

    clickOutside(e) {
      this.sendWidgetAction("toggleLangList");
    },

  })

  api.createWidget("lang-set", {
    tagName: 'div.lang_set',
    buildKey: () => `lang_set`,

    defaultState() {
      let states = {
        langListVisible: false
      };
      return states;
    },

    toggleLangList(){
      this.state.langListVisible = !this.state.langListVisible;
    },
    
    html(attrs, state){
      const panels = [this.attach('lang-default',{langListVisible:state.langListVisible})];
      if(state.langListVisible){
      panels.push(
        this.attach('lang-list-div',{langListVisible:state.langListVisible})
      )}

      return h("div.select-kit.combo-box.set_div",panels);
    },

  })

  api.decorateWidget("header-buttons:before", helper => {
    return helper.attach("lang-set");
  });
}
export default {
  name: "theme",
  initialize() {
    withPluginApi("0.8.7", initialize);
  }
};
