<template>
    <v-container container--fluid ma-0  >
    <v-row cols="12" wrap>
        <v-col :key="1" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card  class="pa-4" outlined  tile color="#e8e8e8"> 
           {{this.belong_items(datas.belongs)}}
            </v-card>
        </v-col >
        <v-col :key="2" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#e8e8e8"> 
           {{datas.title}}
            </v-card>
        </v-col >
        <v-col :key="3" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#e8e8e8"> 
          {{datas.day}}
            </v-card>
        </v-col >
        <v-col :key="4" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#e8e8e8"> 
           {{datas.place}}
            </v-card>
        </v-col >

        <v-col :key="5" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#e8e8e8" > 
            {{mon(datas.day)}}월 생일자
            </v-card>
        </v-col >
        <v-col :key="6" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#ffffff"> 
           {{datas.birthes}}
            </v-card>
        </v-col >
        <v-col :key="7" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#e8e8e8"> 
           새신자
            </v-card>
        </v-col >
        <v-col :key="8" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#ffffff"> 
           {{datas.newes}}
            </v-card>
        </v-col >

        <v-col :key="9" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#e8e8e8"> 
            주일헌금
            </v-card>
        </v-col >
     
        <v-col :key="10" cols="6" xs="6" sm="3" md="3" class="pa-1">
                <v-text-field  solo-inverted prefix=" ￦ " type="number"
                v-model.number='datas.offering'>
                </v-text-field>
        </v-col >
        <v-col :key="11" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#e8e8e8"> 총 재적
            </v-card>
        </v-col >
        <v-col :key="12" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#ffffff"> {{datas.totalmember}}
            </v-card>
        </v-col >

        <v-col :key="13" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#e8e8e8"> 오전 총원
            </v-card>
        </v-col >
        <v-col :key="14" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#ffffff">  {{datas.totalmorning}}
            </v-card>
        </v-col >
        <v-col :key="15" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#e8e8e8"> 오후 총원
            </v-card>
        </v-col >
        <v-col :key="16" cols="6" xs="6" sm="3" md="3" class="pa-1">
            <v-card class="pa-4" outlined  tile color="#ffffff">  {{datas.totalnoon}}
            </v-card>
        </v-col >
    </v-row>
    </v-container>
</template>
<script>
// import CurrencyField from  "./VCurrencyField"
const apiService = require( '@/Services/ApiService')
module.exports =  {
    name: "EventDetail",
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

