# piccolo
mysql sequalize node.js express vue vuetify


how to run :

$ docker-compose up -d

# docker-compose 내용 설명 

  1. backend와 mysql의 연결
  docker ip는 container 생성시 내부적으로 할당 되기 때문에 127.0.0.1로 고정해서 사용할 수 없다. 
  --link $(container_name) 옵션을 사용해도 되지만 backend 와 db container를 연결하기 위해 bridge network를 이용하였다
  backend 의 host name을 container name을 지정하면 contianer의 ip가 변경되어도 자동으로 연결된다. 

  networks:
    db-conn:
      driver: bridge


  2. mysql 의 설정

  해당 container가 업로드된 이미지를 그대로 사용하는 것이면 image: $(image_name):tag 으로 작성하면 되지만
  Dockerfile에 의해 build되는 이미지는 build: $(Dockerfile path) 로 작성하면 된다.

  build: ./db

  docker-compose.yml 파일의해 생성된 container 이름은  $(프로젝트명)-$(Dockerfile에 지정한 이름)으로 만들어진다. 
  특정 이름으로 만들고 싶다면 container_name 옵션을 이용한다

  container_name: piccolo-mysql

  database 명은 ./db/Dockerfile에서 이미 만들어진 schema 파일을 import하는데 거기서 사용한 이름을 그대로 적었다.
  environment:
    MYSQL_DATABASE=edogawa01

  미리 생성한 db-conn 이라는 network bridge를 통해 통신한다.
  networks:
   db-conn

  container 의 실행 여부와 상관없이 데이터가 저장되어야 하므로 db의 volume은 별도로 지정하는 것이 좋다.
  volumes:
   ./db/data:/var/lib/mysql

  3. backend의 설정
  backend는 db container가 먼저 생성된 이후 연결해야 하므로 dependency가 생긴다 
  depends_on:
       piccolo-mysql
       
  접근 가능한 포트를 선언한다. 이 포트를 이용하여 frontend와 통신한다
  ports:
      - "8001:8001"
  
  db와 연결를 위한 네트워크를 선언한다 
  networks:
      - db-conn
      
  npm start로 nodemon을 실행시킨다 
  entrypoint: "npm start"
  
  4. frontend
  다른 옵션은 backend와 비슷하고 webpack을 이용하여 실행 시킨다 
  entrypoint: "npm run dev" 

# 교회 출결 관리 프로그램

화면
- 로그인
- 그래프
- 명단
- 스케쥴
- 출결 현황

기능
- 명단 관리
- 일정 관리
- 예배 관리
- 출결 관리
- 요약 화면

ref : https://github.com/dheeyi/goowil
