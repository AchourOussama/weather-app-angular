def runStage() {
   // Fetch the list of changed files from the last two commits
   def CHANGE_SET = sh(
      script: 'git diff --name-only HEAD~1 HEAD',
      returnStdout: true
   ).trim()
   
   echo "Current changeset: ${CHANGE_SET}"
   
   // Check for changes in specified directories or files 
   return CHANGE_SET =~ /(.*src.*|.*Dockerfile)/
}

pipeline {
    agent any

    environment {
        ACR_REGISTRY = "oussweatherapp.azurecr.io"
        DOCKER_USERNAME= "oussachour"
        DOCKER_PASSWORD = credentials('docker-password')
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_IMAGE_NAME = 'weather-app-frontend'
        DOCKER_IMAGE_TAG = 'latest'
        RESOURCE_GROUP='weather-app-rg'
        WEB_APP_NAME='weather-app-frontend'
    }

    stages { 
        stage('Build Docker Image') {
            when { 
                expression { runStage() }
            }
            steps {
                echo "Changes detected in ./src or Dockerfile. Building a new docker image..."
                script {
                    sh '''
                    docker buildx build --platform linux/amd64,linux/arm64 -t "${ACR_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}" .
                    
                    # Tag the image for DockerHub
                    docker tag ${ACR_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} 
                    '''                
                }
            }
        }

        stage('Push Docker Image to ACR') {
            when { 
                expression { runStage() }
            }
            steps {
                echo "Pushing the new docker image to ACR ..."
                script {
                    sh "az acr login --name ${ACR_REGISTRY}"
                    sh "docker push ${ACR_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            when {  
                expression { runStage() }
            }
            steps {
                echo "Pushing the new docker image to Docker Hub ..."
                script {
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_CREDENTIALS_ID) {
                        sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                        sh "docker push ${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    }
                }
            }
        }
        stage('Deploy to Azure') {
            when { 
                expression { runStage() }
            }
            steps {
                script {
                    // Force Azure to pull the latest image
                    sh """
                        az webapp config container set \
                            --name ${WEB_APP_NAME} \
                            --resource-group ${RESOURCE_GROUP} \
                            --docker-custom-image-name ${ACR_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} \
                            --docker-registry-server-url https://${ACR_REGISTRY}
                    """
                    // Restart the Web App to pull the new image
                    sh "az webapp restart --name ${WEB_APP_NAME} --resource-group ${RESOURCE_GROUP}"
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}

