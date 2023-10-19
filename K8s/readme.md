# Configuration du Cluster et Surveillance avec Prometheus

Ce guide vous explique comment configurer un cluster Kind, charger une image Docker, créer des espaces de noms, et déployer Prometheus pour la surveillance. Vous apprendrez également comment ajouter un Service Monitor pour collecter des métriques d'un microservice.

## Configuration du Cluster Kind

installer kind sur votre ordinateur

Créez un cluster Kind en utilisant la commande suivante :

```bash
kind create cluster --name <clustername>
```

On va éditer la configuration kubeadm et reconfigurer les composants du control-plane car Prometheus n’arrive donc pas à récupérer les métriques

```bash
kubectl -n kube-system edit cm kubeadm-config 
```

```
controllerManager:
  extraArgs:
    bind-address: "0.0.0.0"
scheduler:
  extraArgs:
    bind-address: "0.0.0.0"
etcd:
  local:
    extraArgs:
        listen-metrics-urls: http://0.0.0.0:2381
```


Puis sur chaque nœud du control-plane, on va faire :

```bash
kubeadm upgrade node phase control-plane
```


Le problème est similaire pour le kube proxy, par défaut il n’écoute que sur localhost,

```bash
kubectl -n kube-system edit cm kube-proxy
```

```
metricsBindAddress: 0.0.0.0
```

```bash
kubectl -n kube-system rollout restart daemonset kube-proxy
```


## Création d'un Espace de Noms (Namespace)

Créez un espace de noms (namespace) en utilisant la commande suivante. Vous pouvez créer des espaces de noms pour différentes parties de votre application, par exemple, monitoring, producer, consumer, etc. :

```bash
kubectl create namespace <namespacename>
```
## Chargement d'une Image Docker

Chargez une image Docker spécifique dans le cluster Kind créé précédemment en utilisant  

```bash
kind load docker-image <name:tag> --name <clustername>
```

## Déploiement des Microservices

Après avoir construit votre image Docker pour votre microservice, vous pouvez déployer votre microservice en appliquant vos fichiers de configuration YAML dans l'espace de noms (namespace) dédié à votre microservice.

```bash
cd MicroserviceFolder
```

```bash
kubectl apply -f manifest -n <namespacename>
```

## Déploiement de Prometheus et Grafana


installer helm

```bash
cd monitoring
```

```bash
kubectl create namespace monitoring
```

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

Utilisez Helm pour déployer le stack Prometheus dans l'espace de noms monitoring. Assurez-vous de spécifier les valeurs depuis un fichier values.yaml :

```bash
helm upgrade --install prom prometheus-community/kube-prometheus-stack -n monitoring --values values.yaml
```

```bash
kubectl -n monitoring port-forward prometheus-prom-kube-prometheus-stack-prometheus-0  9090:9090
```

```bash
kubectl -n monitoring port-forward deployment/prom-grafana 3000:3000
```


## Ajout d'un Service Monitor (optionel)

Vous pouvez ajouter un Service Monitor pour collecter des métriques spécifiques d'un microservice en appliquant un fichier YAML nommé servicemonitor.yaml dans le namespace :

```bash
cd monitoring
```

```bash
kubectl apply -f servicemonitor.yaml -n monitoring
```


