**Self-Healing Kubernetes with Prometheus and Grafana**

This project demonstrates the self-healing capabilities of Kubernetes, where the system automatically detects and recovers from application failures. Using Prometheus and Grafana, we set up monitoring and visualization for better insight into the cluster's health.

Features
Kubernetes Deployment with self-healing pods.
Real-time monitoring using Prometheus and Grafana.
Visual dashboards to track application and cluster metrics.
Steps to Set Up the Project
1. Prerequisites
Ensure the following are installed and configured:

Kubernetes cluster (e.g., Minikube, EKS, etc.)
Helm
kubectl

2. Set Up Kubernetes Cluster
Start your Kubernetes cluster using Minikube or any other provider:
**minikube start**

4. Deploy Application
Deploy the backend and frontend services using the YAML configuration files.

Deploy Backend:
**kubectl apply -f backend-deployment.yml**

Deploy Frontend:
**kubectl apply -f frontend-deployment.yml**

Verify the deployment:
**kubectl get pods**

4. Install Prometheus and Grafana
Add the Prometheus Helm repository:

**helm repo add prometheus-community https://prometheus-community.github.io/helm-charts**
**helm repo update**

Install the Prometheus stack:
**helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace**

5. Access Grafana Dashboard
Retrieve the Grafana admin password:
**kubectl get secret -n monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode**

Forward the Grafana service to localhost:

**kubectl port-forward service/monitoring-grafana -n monitoring 3000:80**
Access Grafana at http://localhost:3000 and log in using:

Username: admin
Password: (retrieved from the previous step)

6. Add Prometheus Data Source in Grafana
Go to Configuration > Data Sources in Grafana.
Click Add Data Source.
Select Prometheus and set the URL:
plaintext
Copy code
http://prometheus-operated:9090
Click Save & Test.

7. View Dashboards
Import preconfigured dashboards from the Prometheus Helm chart or create custom ones.
Common dashboards:
Kubernetes Cluster Metrics
Pod and Container Health
Node Resource Usage

8. Test Self-Healing
Simulate a pod failure to test Kubernetes' self-healing:

**kubectl delete pod <pod-name>**

Observe that Kubernetes automatically recreates the pod:

bash
Copy code
kubectl get pods
9. Monitor Metrics
Use the Grafana dashboard to monitor:

CPU and Memory usage
Pod restarts
Request latency


Commands Summary
# Start Minikube
minikube start

# Apply YAML for Backend and Frontend
kubectl apply -f backend-deployment.yml
kubectl apply -f frontend-deployment.yml

# Install Prometheus and Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace

# Retrieve Grafana Admin Password
kubectl get secret -n monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode

# Forward Grafana Service
kubectl port-forward service/monitoring-grafana -n monitoring 3000:80

# Simulate Pod Failure
kubectl delete pod <pod-name>

Future Enhancements
Add alerting rules in Prometheus for critical metrics.
Automate dashboard provisioning using Grafana APIs.
Deploy in a production-grade Kubernetes cluster like EKS.

**Troubleshooting Guide**
1. Pod in CrashLoopBackOff Status
Possible Causes:
Incorrect Docker image.
Missing environment variables.
Application code issues.
**Solutions:**

Check pod logs:

**kubectl logs <pod-name>**

Verify the Docker image in the deployment file.
Ensure environment variables (e.g., database credentials) are correctly set.

2. Prometheus or Grafana Pods Not Running
Possible Causes:
Resource limits exceeded.
Incorrect Helm chart configuration.
**Solutions:**
Check pod status and logs:

**kubectl get pods -n monitoring**
**kubectl logs <pod-name> -n monitoring**

Increase resource allocation or check for Helm configuration errors.

3. Grafana Not Accessible
Possible Causes:
Port-forwarding not set up correctly.
Service not exposed.
**Solutions:**
Ensure port-forwarding is active:

**kubectl port-forward service/monitoring-grafana -n monitoring 3000:80**
Check service status:
**kubectl get services -n monitoring**

4. Metrics Not Showing in Grafana
Possible Causes:
Prometheus data source not configured.
Networking issues.
**Solutions:**
Add Prometheus as a data source in Grafana:

URL: http://prometheus-operated:9090
Check if Prometheus is running:
**kubectl get pods -n monitoring**



