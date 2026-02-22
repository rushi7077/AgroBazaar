pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'rushi7077'
        DOCKERHUB_CREDS = credentials('agrobazaar-creds')
        BACKEND_IMAGE = "${DOCKERHUB_USER}/agrobazaar-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/agrobazaar-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend JAR') {
            steps {
                dir('farmer-backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('farmer-backend') {
                    sh 'docker build -t $BACKEND_IMAGE:latest .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('farmer-frontend') {
                    sh 'docker build -t $FRONTEND_IMAGE:latest .'
                }
            }
        }

        stage('Docker Login') {
            steps {
                sh """
                echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_USER --password-stdin
                """
            }
        }

        stage('Push Backend Image') {
            steps {
                sh 'docker push $BACKEND_IMAGE:latest'
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh 'docker push $FRONTEND_IMAGE:latest'
            }
        }
    }
}