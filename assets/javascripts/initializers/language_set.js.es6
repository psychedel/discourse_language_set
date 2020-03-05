import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";
import { ajax } from "discourse/lib/ajax";
function initialize(api) {
  const allow_user_locale = Discourse.SiteSettings.allow_user_locale;
  const currentUser = api.getCurrentUser();
  if(!allow_user_locale || !currentUser) return;
    
  
  alert(currentUser.get("username"))
  alert(Discourse.User.current().get("username"))
  var username = currentUser.get("username");

  api.createWidget("lang-list", {
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
    html(){
      return h("span.set_span","中文");
    },
    click(){
      this.sendWidgetAction("openLangList");
    }

  })

  api.createWidget("lang-list-div", {

    html(attrs, state){
      var html = []
      const langs = JSON.parse(Discourse.SiteSettings.available_locales)
      langs.map(v =>{
        var item = this.attach('lang-list',v);
        html.push(item) 
      })
      return h("ul.select-kit-collection.set_ul.menu-panel",html);
   
    },

    

  })

  api.createWidget("lang-set", {
    defaultState() {
      let states = {
        langListVisible: false
      };
      return states;
    },
    openLangList(){
      console.log("修改前langListVisible = "+ this.state.langListVisible)
      this.state.langListVisible = true;
      console.log("修改后langListVisible = "+ this.state.langListVisible)
    }
,
    toggleLangList(){
      console.log("toggleLangList")
      console.log("修改前langListVisible = "+ this.state.langListVisible)
      this.state.langListVisible = !this.state.langListVisible;
      console.log("修改后langListVisible = "+ this.state.langListVisible)
      this.toggleBodyScrolling(this.state.langListVisible);
    },
   
    click(e) {
      console.log("clickOutside")
      this.openLangList();
    },
    html(attrs, state){
      console.log("this.state.langListVisible = "+ this.state.langListVisible)
      console.log("state.langListVisible = "+ state.langListVisible)

      const panels = [this.attach('lang-default',{langListVisible:state.langListVisible})];
      if(state.langListVisible){
      panels.push(
        this.attach('lang-list-div',{langListVisible:state.langListVisible})
      )}

      return h("div.select-kit.combo-box.set_div",panels);
    },

  })





  api.createWidget('increment-button', {
    tagName: 'button',

    defaultState() {
      return { clicks: 0 };
    },

    html(attrs, state) { 
      console.log("html this,click ="+this.state.clicks)
      console.log("html click ="+state.clicks)
      return `Click me! ${state.clicks} clicks`;
    },

    click() {
      console.log("点击前 click ="+this.state.clicks)
      this.state.clicks++;
      console.log("点击后 click ="+this.state.clicks)
    }
  });



  api.decorateWidget("header-buttons:before", helper => {
    //return helper.attach("lang-set");
    return helper.attach("increment-button");

  });
}
export default {
  name: "theme",
  initialize() {
    withPluginApi("0.8.7", initialize);
  }
};
