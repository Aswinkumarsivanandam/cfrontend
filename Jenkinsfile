pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID="508498738919"
        AWS_DEFAULT_REGION="us-east-1" 
        IMAGE_REPO_NAME="credor"
        IMAGE_TAG="latest"
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
    }
   
    stages {
        
         stage('Logging into AWS ECR') {
            steps {
                script {
                sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                }
                 
            }
        }
        
        stage('Cloning Git') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[credentialsId: 'a20503ad-5039-4327-b838-da091265f708', url: 'https://github.com/Aswinkumarsivanandam/cfrontend.git']]])     
            }
        }
    // Npm install
        stage('Install') {
            steps{  
                 script {
                    sh "npm install" 
                }
            }
        }
    // NPM build
        stage('Build') {
             steps{  
                script {
                    sh "npm build"
                 }
            }
        }
    // Copying Dist/Credor to dockfiles
        stage('Copying build files') {
            steps{  
                script {
                    sh "cp -r /var/lib/jenkins/workspace/frontendcredor/dist dockfiles/"
                }
            }
        }
  
    // Building Docker images
        stage('Building image') {
            steps{
                script {
                    dockerImage = docker.build "${IMAGE_REPO_NAME}:${IMAGE_TAG}"
                }
            }
        }
   // deleting Old Dock files
        stage('deleting Dock files') {
             steps{  
                 script {
                    sh "rm -r dockfiles/dist"
                }
            }
        }
    // Uploading Docker images into AWS ECR
        stage('Pushing to ECR') {
            steps{  
                script {
                    sh "docker tag ${IMAGE_REPO_NAME}:${IMAGE_TAG} ${REPOSITORY_URI}:$IMAGE_TAG"
                    sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${IMAGE_TAG}"
                 }
            }
        }
    }
}
