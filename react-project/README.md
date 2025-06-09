# 프로젝트간 해당 팀원 REACT 사용 방법 및 규칙

프로젝트간 className과 component들의 위치, path 주소와 각종 첨부파일들의 위치 등을 획일화 하여 관리하기 위해 작성합니다.
팀원분들께서는 확인 후 프로젝트 개발간 팀원과의 마찰이 없도록 해주시면 감사합니다 ^^


# 외국분들이 계셔 번역본 올립니다ㅎ

It is prepared to manage the location of className and components between projects, the path address, and the location of various attachments.
If you don't comply with the terms, I'll have a deep conversation with U ^^


## ********************** Component 관리 항목 ******************************

********폴더명은 소문자 시작, 파일명은 대문자로 시작하되, 각각 카멜케이스를 적용하도록 합니다.
각 component는 component 폴더의 각 항목폴더에 하위파일로 작성 부탁드립니다.
React의 경우 각 component간의 import가 잦은 편이니 꼭 주의하여 생성 및 작성하여 주시기 바랍니다.
좋아요dd
-- 각 component들은 src/component경로에 정렬되어 있습니다. --

## Component 등록, path입력

각 컴포넌트는 BrowserRouter를 통해 관리, 사용됩니다. 페이징을 하기 위해서는 Link 태그, 또는 NavLink태그를 사용하여 (a태그 대신 사용)
페이지 이동할 경로를 입력해 주시기 바라며, 단독으로 사용하여도 기능하지 않으니 
필히 App.js 파일에 Route 등록을 해주셔야 페이징 처리가 가능합니다.

## CSS 파일 관리

각 component의 위치와 대칭되도록 css 폴더 및 파일을 생성해 두었습니다. 
css 파일은 적용시킬 component파일과 파일명이 정확히 일치하게 부탁드리며 확장자만 .css로 변경 부탁드립니다.
css 적용시 선택자는 최대한 상세하게 부탁드리며 다른 파일에 영향이 가지 않도록 

    .main .main-top h1 {} 

해당 방식으로 최대한 상위 선택자를 명시해 주시기 바랍니다.

## resources 폴더 (사진 등의 외부파일)

외부파일 참조시(주로 이미지, 영상) /public/resources 경로의 폴더들을 사용해 주시기 바랍니다.
해당 public 폴더는 React에서 파일을 찾을시 사용하는 기본경로로 해당 경로에 파일을 저장후 
파일 경로를 resources/img/MainImg.png 처럼 사용하시면 보다 간단한 경로로 사용하실 수 있습니다.


## 필요시 추가 폴더 생성

프로젝트 진행중 파일이 아닌 폴더 생성이 불가피한 경우나 폴더 내 하위폴더가 필요한 경우 추가를 개인적으로 할수 있으나
무분별하게 폴더가 생성될 경우 프로젝트 파악에 어려움이 생길 수 있습니다. 
따라서 폴더 생성시에는 생성 여부를 미리 단톡방에 알리고, git commit message에 필히 명시를 해주시기 바랍니다.

## api주소, 키값 등록 --> .env 파일

최상위 폴더 경로에 .env 파일은 리액트 내에서 편하게 대외비 변수를 불러올 수 있도록 설정된 파일입니다. 
api key값 등은 해당 경로에 사용하여 key값이 git에 등록되지 않도록 주의 부탁드리며
해당 변수에 저장된 데이터를 불러 오려면 각 component에서 

    const apiUrl = process.env.REACT_APP_API_URL;

해당 방식으로 변수생성 하여 사용하시면 됩니다. 
(REACT_APP으로 시작하지 않으면 해당 변수를 React가 읽지 못하니 주의)

변수 저장 방식은 "REACT_APP_해당API사이트_용도"로 고정하여 저장하여 주시면 감사하겠습니다. 

    예시) REACT_APP_NAVER_CLIENT_ID=abc123xyz


### 변수명 CamelCase원칙 지켜주세요 ###

### 로그인 작업시 SessionStorage를 사용할 수 있습니다. ###

세션으로 전달해야 할 변수 사용시 모두가 해당 변수를 알고 있어야 하므로 해당 변수명은 이곳에 명시하여 주시기 바랍니다.
-------------------------------------------------------------------------------------
    ex) sessionStorage.setItem('loginUser', user) : 로그인 데이터 저장
