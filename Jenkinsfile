node{
   stage('SCM Checkout'){
     git 'https://github.com/damodaranj/my-app.git'
   }
   stage('Compile-Package'){

      def mvnHome =  tool name: 'maven3', type: 'maven'   
      sh "${mvnHome}/bin/mvn clean package"
	  sh 'mv target/myweb*.war target/newapp.war'
   }
   stage('sock permission'){
       sh 'chmod 777 /var/run/docker.sock'
   }
   stage('Build Docker Imager'){
   sh 'docker build -t aswinkumarsivanandam/myweb:0.0.2 .'
   }
   stage('Docker Image Push'){
   withCredentials([string(credentialsId: 'dockerPass', variable: 'dockerPassword')]) {
   sh "docker login -u aswinkumarsivanandam -p ${dockerPassword}"
    }
   sh 'docker push aswinkumarsivanandam/myweb:0.0.2'
   }