<template>
  <div></div>
</template>

<script>
module.exports ={
  name: 'Logout',
  created () {
    delete localStorage.user
    this.$router.replace('/')
    this.$router.go('/')
    // window.history.push(null,'','/')
    // window.history.go('/')
  }
}
</script>
