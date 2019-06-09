<template>
  <v-app id="dayspan" v-cloak>

    <ds-calendar-app ref="app"
      :calendar="calendar"
      :read-only="readOnly"
      @change="saveState">

      <template slot="eventPopover" slot-scope="slotData">
         <ds-calendar-event-popover
          v-bind="slotData"
          :read-only="readOnly"
          @finish="saveState"
        ></ds-calendar-event-popover>
      </template>

      <template slot="eventCreatePopover" slot-scope="{placeholder, calendar, close}">
        <ds-calendar-event-create-popover
          :calendar-event="placeholder"
          :calendar="calendar"
          :close="$refs.app.$refs.calendar.clearPlaceholder"
          @create-edit="$refs.app.editPlaceholder"
          @create-popover-closed="saveState"
        ></ds-calendar-event-create-popover>
      </template>

      <template slot="eventTimeTitle" slot-scope="{calendarEvent, details}">
        <div>
          <v-icon class="ds-ev-icon"
            v-if="details.icon"
            size="14"
            :style="{color: details.forecolor}">
            {{ details.icon }}
          </v-icon>
          <strong class="ds-ev-title">{{ details.title }}</strong>
        </div>
        <div class="ds-ev-description">{{ getCalendarTime( calendarEvent ) }}</div>
      </template>

      <template slot="drawerBottom">
        <div class="pa-3">
          <v-checkbox
            label="Read Only?"
            v-model="readOnly"
          ></v-checkbox>
        </div>
      </template>

    </ds-calendar-app>

  </v-app>
</template>

<script>
import { Calendar, Weekday, Month } from 'dayspan';
import apiService from '@/Services/ApiService'
import fr from 'dayspan-vuetify/src/locales/fr';
import Vue from 'vue';

export default {
  name: 'eventdayspan',
  data: () => ({
    storeKey: 'dayspanState',
    calendar: Calendar.months(),
    readOnly: false,
    events: [],
    eIndex: 0,
    color:['#3F51B5', '#4CAF50', '#2196F3', '#1976d2','#4CAF50' ],


  
  }),
  mounted()
  {
    window.app = this.$refs.app;
    this.$dayspan.addLocales(['fr', 'fr-CA', 'fr-BE', 'fr-CH', 'fr-FR', 'fr-LU', 'fr-MC'], fr);
    this.$dayspan.setLocale('fr',true);
    this.loadState();
  },
  methods:
  {
    getCalendarTime(calendarEvent)
    {
      let sa = calendarEvent.start.format('a');
      let ea = calendarEvent.end.format('a');
      let sh = calendarEvent.start.format('h');
      let eh = calendarEvent.end.format('h');
      if (calendarEvent.start.minute !== 0)
      {
        sh += calendarEvent.start.format(':mm');
      }
      if (calendarEvent.end.minute !== 0)
      {
        eh += calendarEvent.end.format(':mm');
      }
      return (sa === ea) ? (sh + ' - ' + eh + ea) : (sh + sa + ' - ' + eh + ea);
    },
    async saveState()
    {
      let state = this.calendar.toInput(true);
      
      let json = JSON.stringify(state);
      this.events[0].calendar = json
      await apiService.updateEvents(this.events[0])
    },
    async loadState()
    {
      let state = {};
      try
      {
        const response = await apiService.fetchEvents()
        this.events = response.data
        let json =  this.events[0].calendar;
        let savedState = JSON.parse(json);
        if (savedState)
        {
          state = savedState;
          state.preferToday = false;
        //   console.log( state );
        }
      }
      catch (e)
      {
        // eslint-disable-next-line
        console.log( e );
      }

      this.$refs.app.setState( state );
    },
    //  async getevents () {
    //     const response = await apiService.fetchEvents()
    //     this.events = response.data

    // },

  }
}
</script>

<style>
body, html, #app, #dayspan {
  font-family: Roboto, sans-serif !important;
  width: 100%;
  height: 100%;
}
.v-btn--flat,
.v-text-field--solo .v-input__slot {
  background-color: #f5f5f5 !important;
  margin-bottom: 8px !important;
}
</style>