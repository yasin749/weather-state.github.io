import Vue from "vue/dist/vue";
import VueResource from 'vue-resource'
import config from '../../config'
import dateTimeFormat from '../helpers/date-time-format'
import weatherBox from './weather-box'

Vue.use(VueResource);

var weatherBoxList = Vue.component('weather-box-list', {
    data: function () {
        return {
            cities: [],
            nowDate: this.nowDateString(new Date())
        }
    },
    created() {
        this.loadCities();
    },
    methods: {
        loadCities: function () {
            let cities = config.weatherState.cities;

            for (var city in config.weatherState.cities) {
                let cityId = cities[city].id;
                let apiUrl = this.apiUrlPrepared(cityId);

                this.apiFetchData(apiUrl);
            }
        },
        apiUrlPrepared: function (cityId) {
            let apiUrl = `${config.weatherState.api.dataUrl}weather?id=${cityId}&appid=${config.weatherState.api.appId}&units=metric`;
            return apiUrl;
        },
        apiFetchData: function (url) {
            this.$http.get(url).then(response => {
                this.cities.push(response.body);
            }, response => {
                console.log('Api verileri alınamadı');
            });
        },
        nowDateString: function (date) {
            const formattedDate = dateTimeFormat(date);
            return `${formattedDate.dayNumber} ${formattedDate.monthName} ${formattedDate.dayName}`;
        }
    },
    template: `
        <div class="row">
            <div class="col-12">
                <h1>{{nowDate}}</h1>
            </div>
            <div class="col-12" v-if="cities.length == 0">Loading...</div>
            <div class="col-4 col-xs-6" v-for="(city, index) in cities">
                <weather-box v-bind:city="city"></weather-box>
            </div>
        </div>
    `
})

export default weatherBoxList;