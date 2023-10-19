from pyspark.sql import SparkSession
from pyspark.sql.functions import *

# Création d'une session Spark
spark = SparkSession.builder.appName("KafkaSparkStreaming").getOrCreate()

# Config de la session Spark
kafka_stream = spark.readStream.format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "nom_du_topic") \
    .load()

# Traitement des données
processed_data = kafka_stream.selectExpr("CAST(value AS STRING)")

# Sortie des données
query = processed_data.writeStream.outputMode("append") \
    .format("console") \
    .start()

query.awaitTermination()
