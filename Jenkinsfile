pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        CYPRESS_CACHE_FOLDER = '.cypress'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                script {
                    // Setup Node.js
                    sh '''
                        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                        nvm install ${NODE_VERSION}
                        nvm use ${NODE_VERSION}
                    '''
                    
                    // Install dependencies
                    sh 'npm ci'
                }
            }
        }
        
        stage('Lint & Format') {
            parallel {
                stage('ESLint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Prettier') {
                    steps {
                        sh 'npm run format -- --check'
                    }
                }
            }
        }
        
        stage('Smoke Tests') {
            steps {
                sh '''
                    npm run test:smoke
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports/html',
                        reportFiles: '*.html',
                        reportName: 'Smoke Test Report'
                    ])
                }
            }
        }
        
        stage('Regression Tests') {
            parallel {
                stage('Chrome') {
                    steps {
                        sh '''
                            npm run test:multi-report -- --browser chrome
                        '''
                    }
                }
                stage('Firefox') {
                    steps {
                        sh '''
                            npm run test:multi-report -- --browser firefox
                        '''
                    }
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports/html',
                        reportFiles: '*.html',
                        reportName: 'Regression Test Report'
                    ])
                    
                    // Publish JUnit results
                    junit 'cypress/reports/junit/*.xml'
                }
            }
        }
        
        stage('API Tests') {
            steps {
                sh '''
                    npm run test:api
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports/html',
                        reportFiles: '*.html',
                        reportName: 'API Test Report'
                    ])
                }
            }
        }
        
        stage('Visual Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    changeRequest()
                }
            }
            steps {
                sh '''
                    npm run test:visual
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports/html',
                        reportFiles: '*.html',
                        reportName: 'Visual Test Report'
                    ])
                    
                    // Archive screenshots
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*', fingerprint: true
                }
            }
        }
        
        stage('Performance Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                sh '''
                    npm run test:performance
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports/html',
                        reportFiles: '*.html',
                        reportName: 'Performance Test Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            script {
                // Send success notification
                echo 'All tests passed successfully!'
            }
        }
        failure {
            script {
                // Send failure notification
                echo 'Some tests failed. Check the reports for details.'
            }
        }
        unstable {
            script {
                // Send unstable notification
                echo 'Tests completed with some failures. Check the reports for details.'
            }
        }
    }
}
