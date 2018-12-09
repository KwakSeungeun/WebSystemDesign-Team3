<template>
    <div id="AlarmDetails">
        <div v-for="alarm in sortedAlarmList">
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

                <b-link href="#"
                        class="card-link">삭제</b-link>
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

                return this.$store.state.alarmList.sort(compare);
            },
            alarmList: function() {
                return this.$store.state.alarmList;
            }
        },
        methods: {
            readAlarm: function(alarm) {
                console.log(alarm);
                this.$http.post(`${this.$config.serverUri}user/alarms/read`, alarm).then(result => {
                    console.log(this)
                    this.$store.commit('setReadAlarm', alarm._id);
                    this.$store.commit('noticeDecrease');
                }).catch(err => {
                   alert('표시하는데 실패했습니다..');
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