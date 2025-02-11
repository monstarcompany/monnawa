import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import {   supabase as supabase2 } from '~/server/utils/supabase';

// Supabase URL 및 API 키 설정
const supabaseUrl = `${process.env.SUPABASE_URL}/functions/v1/generate_invite`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
console.log('supabaseUrl ' )
console.log('supabaseUrl ' + supabaseUrl)
// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);


export default defineEventHandler(async (event) => {

    // Authorization 헤더에서 토큰을 추출
    const token = event.node.req.headers['authorization']?.split(' ')[1];  // 헤더 이름은 'authorization'이므로 소문자로 확인
    const decoded = jwt.decode(token);
    var userUid = decoded.sub;
    console.log(JSON.stringify(decoded))

    if (event.node.req.method === 'POST') {

        const body = await readBody(event);
        const { base64File, filename, fileType } = body;
        if (!base64File || !filename || !fileType) {
            throw new Error("Invalid request data");
        }
        const binaryData = Buffer.from(base64File, "base64");

        // Supabase 스토리지에 파일 업로드
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}-${filename}`; // 유니크 파일 이름 생성

        console.log(uniqueFileName)
        const storageResponse = await fetch(
            `https://uqqeqjvjhcotrtdftjvk.supabase.co/storage/v1/object/invitePicture/${uniqueFileName}`, // Supabase 스토리지 URL
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${supabaseKey}`, // Supabase 익명 키
                    "Content-Type": "image/png", // 클라이언트에서 전달받은 파일 타입
                },
                body: binaryData,
            }
        );

        const file = await storageResponse.json();

        const { data, error } = await supabase.functions.invoke('generate_invite', {
            body: JSON.stringify({
                filename: file.Key,
                // base64: base64Data, // Base64로 변환된 이미지 데이터
                user : token
            }),
        })

        console.log(JSON.parse(data).savedData.id)



        var invite_id = JSON.parse(data).savedData.id + '';
        var user_id = userUid
        console.log("ㅁㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ " + JSON.stringify({
            invite_id ,
            user_id,
        }))
        const { data:data2 , error:error2 } =  await supabase2
            .from('invite_user') // 조회할 테이블 이름
            .insert([
                {
                    invite_id,
                    user_id,
                },
            ]);

        if (error2) {
            console.error(error2);
            return { status: 500, message: 'Failed to fetch data', error2 };
        }

        return new Response(JSON.stringify({ message: data }), { status: 200 });

    }




});
