<template>
  <div id="card">
    <header>
      <img class="avatar" :src="user.userFace" :alt="user.name">
      <p class="name">{{user.name}}</p>
    </header>
    <footer>
      <input class="search"
             type="text"
             v-model="$store.state.filterKey"
             placeholder="search user..."
      >
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Card',
  data () {
    return {
      user: this.SessionStorage.get("USER")
    }
  }
}
</script>

<style lang="scss" scoped>
#card {
	padding: 12px 12px 0 12px;
  .avatar{
    width: 45px;
    height: 45px;
    border-radius: 24px;
    vertical-align: middle;/*这个是图片和文字居中对齐*/
  }
  .name {
    display: inline-block;
    padding: 10px;
    margin-bottom: 15px;
    font-size: 16px;
  }
  .search {
    background: #26292E;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border: 1px solid #3a3a3a;
    border-radius: 4px;
    outline: none;/*鼠标点击后不会出现蓝色边框*/
    color: #FFF;
  }
}
</style>
