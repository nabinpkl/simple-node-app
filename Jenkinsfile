
pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS' // Assumes NodeJS is configured in Jenkins tools
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
        SONARQUBE_SERVER = 'SonarQube'  // Name configured for SonarQube in Jenkins
        NEXUS_URL = 'http://192.168.2.14:8081/repository/my-npm-repository' // Nexus URL
        NEXUS_REPO = 'my-npm-repository'
        NEXUS_CREDENTIALS_ID = 'NEXUS_CREDENTIALS_ID' // Jenkins credentials ID for Nexus
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'  // Assumes build command is defined in package.json
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner';
                    withSonarQubeEnv("SonarQube") {
                         sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=my-nodejs-project"
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 1, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }
        
        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
            }
        }

        stage('Deploy to Nexus') {
            steps {
                nexusArtifactUploader artifacts: [
                    [artifactId: 'my-app', classifier: '', file: 'dist/my-app.zip', type: 'zip']
                ],
                credentialsId: "${NEXUS_CREDENTIALS_ID}",
                groupId: 'com.nabin',
                nexusUrl: "${NEXUS_URL}",
                repository: "${NEXUS_REPO}",
                version: '1.0.0',
                nexusVersion: '3',
                protocol: 'http' 
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
