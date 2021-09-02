<template>
  <div id="chat">
    <div class="sidebar">
      <Card />
      <List />
    </div>
    <div class="main">
      <Message />
      <UserText />
    </div>
  </div>
</template>

<script>
import Card from "../../components/page/chat/Card";
import List from "../../components/page/chat/List";
import Message from "../../components/page/chat/Message";
import UserText from "../../components/page/chat/UserText";

export default {
  name: "ChenChat",
  components: {
    UserText,
    Message,
    List,
    Card
  },

  mounted() {
    this.$store.dispatch('initData');
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
#chat {
  margin: 20px auto;
  width: 800px;
  height: 600px;
  overflow: hidden;
  border-radius: 10px;
  .sidebar, .main {
    height: 100%;
  }
  .sidebar {
    float: left;
    color: #f4f4f4;
    background-color: #2e3238;
    width: 200px;
  }
  .main {
    position: relative;
    overflow: hidden;
    background-color: #eee;
  }
}
</style>