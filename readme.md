# CRYPTO VIZ

![Graph](assets/graph.png)

### Description 

CRYPTO VIZ est un projet Big Data qui vise à collecter, traiter et visualiser des données financières liées à des cryptomonnaies. Il utilise des technologies telles que Kafka et Spark pour collecter et analyser en temps réel les données de différentes plateformes de trading de cryptomonnaies

## Project 

Le projet CRYPTO VIZ a pour objectif de fournir une plateforme d'analyse de données de cryptomonnaies en temps réel, offrant une vue détaillée des marchés de cryptomonnaies. 
Les principales fonctionnalités du projet incluent :

- La collecte de données en temps réel à partir de diverses sources de données de cryptomonnaies via des services.
- Le stockage et le traitement efficace de ces données à l'aide de technologies Big Data.
- L'analyse des tendances, la détection de motifs et la génération de statistiques significatives.
- La création de visualisations interactives pour permettre aux utilisateurs de suivre les évolutions des cryptomonnaies.

### Kube

### Services

### Kafka 

kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic datas_binance

### Spark 

spark-submit --master spark://spark:7077 --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.2.0 <SCRIPT_NAME>
