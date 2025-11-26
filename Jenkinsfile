pipeline {
    agent any
    enviornment {
        NETWORK = 'ftr-network'
        BACKEND_IMAGE = 'ftr-backend'
        FRONTEND_IMAGE = 'ftr-frontend'
    }
    stages {
        stage('Checkout') { steps {checkout scm }}
        stage('Setup Network') {steps {sh "docker network create ${env.NETWORK} || TRUE"}}
        stage('Build Backend') {steps {dir('website-ftr/Server') {script {docker.build("${env.BACKEND_IMAGE}:${env.BUILD_ID}")}}}}
        stage('Build Frontend') {steps {dir('website-ftr/client/clientapp') {script {docker.build("${env.FRONTEND_IMAGE}:${env.BUILD_ID}")
        }}}}
        stage('Deploy'){
            steps {
                script {
                    sh "docker stop ${env.BACKEND_IMAGE} || true"
                    sh "docker rm ${env.BACKEND_IMAGE} || true"
                    sh "docker stop ${env.FRONTEND_IMAGE} || true"
                    sh "docker rm ${env.FRONTEND_IMAGE} || true"
                    sh """
                    docker run -d --name ${env.BACKEND_IMAGE} \
                        --network ${env.NETWORK} \
                        -e NODE_ENV=production \
                        -e DATABASE_URL=\${env.PROD_DATABASE_URL} \
                        ${env.BACKEND_IMAGE}:${env.BUILD_ID}
                    """
                    sh """
                    docker run -d --name ${env.FRONTEND_IMAGE} \
                        --network ${env.NETWORK} \
                        -p 80:80 \
                        ${env.FRONTEND_IMAGE}:${env.BUILD_ID}
                    """
                }
            }
        }
    }
}