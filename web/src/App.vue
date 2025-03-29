<template>
  <NavBar />
  <router-view></router-view>
</template>

<script>  //写js代码
import NavBar from "@/components/NavBar.vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"


export default {
  components: {
    NavBar
  },
  setup() {
    // $.ajax({
    //   url: "http://localhost:3000/user/account/token/",
    //   type: "post",
    //   data: {
    //     username: 'yxc',
    //     password: "pyxc",
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   }
    // });
    // $.ajax({
    //   url:"http://localhost:3000/user/account/info/",
    //   type: "get",
    //   headers: {
    //     Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmZWVhNjRmMmJiNTA0Y2RiYmU3OWQ0MTc5NWE3MWJlYSIsInN1YiI6IjIiLCJpc3MiOiJzZyIsImlhdCI6MTc0MzE2NTYxMCwiZXhwIjoxNzQ0Mzc1MjEwfQ.VNcTmq5HEGlLXbeGi0c-b2T2KiMAbKYGBxd8WGphP0o",
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   }
    // }),
    // $.ajax({
    //   url: "http://localhost:3000/user/account/register/",
    //   type: "post",
    //   data: {
    //     username: "yxc5",
    //     password: "123",
    //     confirmedPassword: "123",
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   }
    // })
  }
}
</script>



<style>  
body{
  background-image: url("@/assets/images/background2.png");
  background-size: cover;
}
</style>
