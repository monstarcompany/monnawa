<script setup>
import { ref } from "vue";

const invitation = ref(false);
import { roomService } from '/services/room/roomService'
import { userService } from '/services/userService'

import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id;


// 예약 정보
const reservationLeader = ref("")
const reservationDate = ref("")
const reservationStore = ref("")
const reservationEp = ref("")
const roomId = ref("")
const userProfileImages = ref([])  // 여러 명의 프로필 이미지 저장

onMounted(() => {
  getReservationData();

})


const { getRoom, join } = roomService();
const { getUserInfo } = userService();
//이미지 정보 가져오기
const getReservationData = async () => {

  const roomInfo = await getRoom({id: id});
  console.log(roomInfo);

  const inviteUserInfo = await getUserInfo({id: roomInfo.data[0].room_user});
  console.log(inviteUserInfo);
  userProfileImages.value = roomInfo.data[1].users.map(user => user.profile_image || "@/assets/images/invite/default_profile.png");  // 기본 이미지 설정

  //더미 데이터
  reservationLeader.value = inviteUserInfo.user.user.identities[0].identity_data.name
  reservationDate.value = roomInfo.data[0].date + " " +roomInfo.data[0].time
  reservationStore.value = roomInfo.data[0].company
  reservationEp.value = roomInfo.data[0].theme

  roomId.value = roomInfo.data[0].id;
}

// 초대한 게임 참석하기
const togethrPlay = () => {
  join({id: roomId.value}).then(()=> {
    console.log("success")
  })
}
</script>

<template>
  <div class="container invitation">
    <div class="invitation_message">
      <strong>{{ reservationLeader }}님의</strong>
      <p>예약에 초대합니다.</p>
    </div>

    <!-- 카드 하나로 처리, userProfileImages 배열을 순회하면서 이미지 넣기 -->
    <div v-for="(profileImage, index) in userProfileImages" :key="index" class="card">
      <div class="inner">
        <div class="front">
          <img class="card" :src="profileImage" alt="카드 앞면" width="197"/>
        </div>
        <div class="back">
          <img class="card" src="@/assets/images/invite/card_back.png" alt="카드 뒷면" width="197"/>
        </div>
      </div>
    </div>


    <!-- 예약 정보 -->
    <!-- 이미지 분석후 파일 데이터 추가 -->
    <div class="info_wrap">
      <div class="info">
        <div class="details">
          <p><strong>날짜</strong><span>{{ reservationDate }}</span></p>
          <p><strong>장소</strong><span>{{ reservationStore }}</span></p>
          <p><strong>테마</strong><span>{{ reservationEp }}</span></p>
        </div>
      </div>
    </div>
    <button class="share_btn" @click="togethrPlay">함께 할게요!</button>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
  font-family: 'Noto Sans', sans-serif;
}

.invitation_message {
  text-align: center;
  font-size: 26px;
  padding-top: 40px;
  padding-bottom: 20px;
}

.info_wrap {
  padding: 20px;
  margin: 0px auto 20px auto;
  border-radius: 0 0 8px 8px;
  width: 300px;
  margin-top: -8px;
}

.details {
  padding: 20px;
  font-size: 16px;
  font-weight: 400;
}

.details p {
  margin: 5px 0;
  border-bottom: 1px solid #E1E1E1;
  display: flex;
  justify-content: flex-start;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.details p:last-child {
  border-bottom: 0;
}

.details p strong {
  padding-right: 20px;
}

.details p span {
  display: block;
  overflow-wrap: anywhere;
  flex: 1;
  text-align: left;
}

.info_wrap strong, .details p strong {
  font-weight: 400;
}

.card {
  width: 197px;
  height: 218px;
  perspective: 1000px; /* 플립 효과를 위한 3D 시점 */
  padding: 20px;
  margin: 0 auto;
}

.inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: flip 2s ease-in-out forwards;
}

.front, .back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* 뒷면 숨기기 */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-size: 1.2rem;
}

.front {
  background-color: #fff;
  color: white;
}

.back {
  background-color: #fff;
  color: white;
  transform: rotateY(180deg); /* 뒷면 뒤집기 */
}

@keyframes flip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(360deg); /* 1바퀴 */
  }
  100% {
    transform: rotateY(720deg); /* 2바퀴 */
  }
}

.share_btn {
  display: block;
  width: 100%;
  background-color: #FF624E;
  font-size: 16px;
  border-radius: 8px;
  overflow: hidden;
  border: 0;
  padding: 15px 20px;
  color: #fff;
}
</style>