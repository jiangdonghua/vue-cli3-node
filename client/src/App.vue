<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  import jwt_code from 'jwt-decode';
  import {mapActions} from 'vuex';

  export default {
    name: "app",
    created(){
      const token=localStorage.eleToken;

      if(token){
        const decoded = jwt_code(token);
        //console.log(this.isEmpty(decoded))
        //token 存储到vuex中
        this.setIsAuthenticated(!this.isEmpty(decoded))
        //储存用户信息
        this.setUser(decoded)
      }
    },
    methods: {
      ...mapActions([
        'setIsAuthenticated',// 映射 this.setIsAuthenticated() 为this.$store.dispatch('setIsAuthenticated')]),
        'setUser'
      ]),

      isEmpty(value){
        return (
          value === undefined || value === null ||
          (typeof value === "object" && Object.keys(value).length===0) ||
          (typeof value === "string" && value.trim().length===0)

        )
      }
    }
  }
</script>
<style lang="scss">
html,body,#app {
  width: 100%;
  height: 100%;
}

</style>
