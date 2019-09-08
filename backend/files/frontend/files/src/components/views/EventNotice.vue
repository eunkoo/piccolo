<template>
  <v-row>
    <v-container container--fluid ma-0 pa-2>
        <v-textarea
            ref="textnotice"
            outlined
            label="광고"
            rows="10"
            auto-grow
            :readonly="printingview"
            @focus="focusOn" @blur="blur" v-model="datas.notice"></v-textarea>
    </v-container>
  </v-row>
</template>

<script>
const apiService = require( '@/Services/ApiService')
module.exports ={
    name: "EventNotice",
    components:{
        
    },
    props: {datas: Object,printingview:Boolean},
    mounted(){
        this.edited = false
    },
    data(){
        return {
            edited : true,
            announce : 'test',
            changed :false
        }
    },
   
    methods:{
         changeNotice(){
            this.$emit('changeNotice',this.datas.notice)
        },
        focusOn(){
            this.edited = true
        },
        blur(){
            this.edited = false
            this.changed = true
              this.changeNotice()
        },
        async save() {
            // if(!this.changed) return 
            // console.log('event notice save')
            // try {
            //     // await apiService.updateEvents(this.datas)
            //     this.changed = false
            // } catch (err) {
            //     return console.log(err.message)
            // } finally {
            //     this.close()
              
            // }
        },
        close(){
              this.edited = false
        }
    }
}
</script>