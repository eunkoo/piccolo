<template>
  <v-layout>
    <v-container fill-height fluid ma-0 pa-2>
        <v-textarea
            ref="textnotice"
            outline
            label="광고"
            @focus="focusOn" @blur="blur" v-model="datas.notice"></v-textarea>
    </v-container>
  </v-layout>
</template>

<script>
import apiService from '@/Services/ApiService'
export default {
    components:{
        
    },
    props: ['datas'],
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
