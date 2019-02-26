<template>
<div class="index">
  <header-nav></header-nav>
  <LeftMenu></LeftMenu>
  <div class="rightContainer"><router-view></router-view></div>
</div>
</template>

<script type="text/ecmascript-6">
import HeaderNav from '../components/HeaderNav'
import LeftMenu from '../components/LeftMenu'
    export default {
      name:"index",
      components:{HeaderNav,LeftMenu}
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .index {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .rightContainer {
    position: relative;
    top: 0;
    left: 180px;
    width: calc(100% - 180px);
    height: calc(100% - 71px);
    overflow: auto;
  }
</style>
