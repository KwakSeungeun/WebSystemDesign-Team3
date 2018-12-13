<template>
    <div id="AlarmDetails">
        <div v-for="alarm in sortedAlarmList" :key="alarm._id">
            <b-card class="alarmCard" title=""
                    sub-title="">
                <p v-if="alarm.read == true" class="card-text">
                    {{alarm.contents}}
                </p>
                <p v-if="alarm.read == false" class="card-text">
                    <b>{{alarm.contents}}</b>
                </p>

                <a v-if="alarm.read == false" href="#"
                   class="card-link" @click="readAlarm(alarm)">읽음 으로 표시</a>

                <router-link style="text-decoration:none !important;"
                             :to="{name: 'trade-details', params:{id: alarm.trade_id}}"
                             class="card-link">
                    <span v-on:click="closeThisModal">거래 보기</span>
                </router-link>

                <b-link href="#"
                        class="card-link" @click="deleteAlarm(alarm)">삭제</b-link>
            </b-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AlarmDetails",
        computed: {
            sortedAlarmList: function() {
                function compare(a, b) {
                    if (a.read == false && b.read == true)
                        return -1;
                    if (a.read == true && b.read == false)
                        return 1;
                    return 0;
                }

                return this.$store.state.alarmList.reverse().sort(compare);
            },
            alarmList: function() {
                return this.$store.state.alarmList;
            }
        },
        methods: {
            readAlarm: function(alarm) {
                console.log(alarm);
                this.$http.post(`${this.$config.serverUri}user/alarms/read`, alarm).then(result => {
                    this.$store.commit('noticeDecrease');
                    this.$store.commit('setReadAlarm', alarm._id);
                }).catch(err => {
                   alert('표시하는데 실패했습니다..');
                });
            },
            closeThisModal: function() {
                this.$emit('exit', true);
            },
            deleteAlarm: function(alarm) {
                this.$http.post(`${this.$config.serverUri}user/alarms/delete`, alarm).then(result => {
                    if(alarm.read == false) this.$store.commit('noticeDecrease');
                    this.$store.commit('deleteAlarm', alarm._id);
                }).catch(err => {
                    alert('삭제하는데 실패했습니다..');
                });
            }
        }
    }
</script>

<style scoped>
    .alarmCard {
        margin-bottom: 3px;
        margin-top: 3px;
    }
</style>