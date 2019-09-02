<template>
    <v-container fluid ma-0 pa-2 >
    <v-layout fill-height wrap>
        <v-flex :key="1" xs6 sm3 md3>
            <v-card  color="#e8e8e8"> 
            <v-card-text class="px-0">{{this.belong_items(datas.belongs)}}</v-card-text>
            </v-card>
        </v-flex >
        <v-flex :key="2" xs6 sm3 md3>
            <v-card  color="#e8e8e8"> 
            <v-card-text class="px-0">{{datas.title}}</v-card-text>
            </v-card>
        </v-flex >
        <v-flex :key="3" xs6 sm3 md3>
            <v-card  color="#e8e8e8"> 
            <v-card-text class="px-0">{{datas.day}}</v-card-text>
            </v-card>
        </v-flex >
        <v-flex :key="4" xs6 sm3 md3>
            <v-card  color="#e8e8e8"> 
            <v-card-text  class="px-0">{{datas.place}}</v-card-text>
            </v-card>
        </v-flex >

        <v-flex :key="5" xs6 sm3 md3>
            <v-card  color="#e8e8e8" > 
            <v-card-text class="px-0">{{mon(datas.day)}}월 생일자</v-card-text>
            </v-card>
        </v-flex >
        <v-flex :key="6" xs6 sm3 md3>
            <v-card  color="#ffffff"> 
            <v-card-text multiline class="px-0">{{datas.birthes}}</v-card-text >
            </v-card>
        </v-flex >
        <v-flex :key="7" xs6 sm3 md3>
            <v-card  color="#e8e8e8"> 
            <v-card-text class="px-0">새신자</v-card-text>
            </v-card>
        </v-flex >
        <v-flex :key="8" xs6 sm3 md3>
            <v-card  color="#ffffff"> 
            <v-card-text multiline class="px-0">{{datas.newes}}</v-card-text>
            </v-card>
        </v-flex >

        <v-flex :key="9" xs6 sm3 md3>
            <v-card  color="#e8e8e8"> 
            <v-card-text class="px-0">주일헌금</v-card-text>
            </v-card>
        </v-flex >
     
        <v-flex :key="10" xs6 sm3 md3>
            <v-layout wrap color="#ffffff"> 
                <v-text-field
                v-model='datas.offering'>
                </v-text-field>
            </v-layout> 
        </v-flex >
        <v-flex :key="11" xs6 sm3 md3>
            <v-card  color="#e8e8e8"> 
            <v-card-text  class="px-0">총 재적</v-card-text>
            </v-card>
        </v-flex >
        <v-flex :key="12" xs6 sm3 md3>
            <v-card  color="#ffffff"> 
            <v-card-text  class="px-0">{{datas.totalmember}}</v-card-text>
            </v-card>
        </v-flex >

        <v-flex :key="13" xs6 sm3 md3>
            <v-card  color="#e8e8e8"> 
            <v-card-text  class="px-0">오전 총원</v-card-text>
            </v-card>
        </v-flex >
        <v-flex :key="14" xs6 sm3 md3>
            <v-card  color="#ffffff"> 
            <v-card-text  class="px-0">{{datas.totalmorning}}</v-card-text>
            </v-card>
        </v-flex >
        <v-flex :key="15" xs6 sm3 md3>
            <v-card  color="#e8e8e8"> 
            <v-card-text  class="px-0">오후 총원</v-card-text>
            </v-card>
        </v-flex >
        <v-flex :key="16" xs6 sm3 md3>
            <v-card  color="#ffffff"> 
            <v-card-text  class="px-0">{{datas.totalnoon}}</v-card-text>
            </v-card>
        </v-flex >
    </v-layout>
    </v-container>
</template>
<script>
// import CurrencyField from  "./VCurrencyField"
const apiService = require( '@/Services/ApiService')
export default {
    props: ['datas','printing'],
    components:{
        // CurrencyField
    },
    methods:{
          async save () {
            // if(!this.changed) return
            // console.log('event detail save')
            // try {
            //     console.log(this.datas)
            //     await apiService.updateEvents(this.datas)
            //     this.changed = false
            
            // } catch (err) {
            //     return console.log(err.message)
            // } finally {
            //     // this.close()
            // }
        },
        confirmOffering(){
            this.changed = true;
             this.$emit('changeOffering',this.datas.offering)
            // this.save()
        },
        changeOffering(){
            
        }
    },
    data(){
        return{
            changed: false,
            mon : function(date){
                return new Date(date).getMonth()+1
            },
            priceValidationErrors: '금액을 입력해 주세요',
            belong_items: function(id){
                if(id === 0) return '유치부'
                else if(id === 1) return '유초등부'
                else if(id === 2) return '중고등부'
                else if(id === 3) return '청년부'
                else if(id === 4) return '면려회'
            }
      
        }
    }
//    <style>
// .v-card{
//     min-height:52px
// }
// </style>

}
</script>

