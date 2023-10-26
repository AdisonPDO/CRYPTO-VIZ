from pyspark.sql import SparkSession
from pyspark.sql.functions import *

# Binance Spark Streaming

# Création d'une session Spark
spark = SparkSession.builder.appName("KafkaSparkStreaming").getOrCreate()

# Config de la session Spark
kafka_stream = spark.readStream.format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "datas_binance") \
    .load()

# Traitement des données

# Definition du schema pour le type de message suivant
# let crypto = {
#     "name": stockObject.s,
#     "date": new Date(stockObject.E).toISOString(),
#     "value": parseFloat(stockObject.p).toFixed(2)
# }
schema = StructType().add("name", StringType()).add("date", StringType()).add("value", StringType())

# Conversion des données en format df
data_df = kafka_stream.selectExpr("CAST(value AS STRING)").select(from_json("value", schema).alias("crypto_data"))

# Sortie des données
query = data_df.writeStream.outputMode("append") \
    .format("console") \
    .start()

query.awaitTermination()