from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import StructType, StructField, StringType

# Binance Spark Streaming

# Création d'une session Spark
spark = SparkSession.builder.appName("BinanceSession").getOrCreate()

# Config de la session Spark
kafka_stream = spark.readStream.format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "datas_binance") \
    .load()



# Traitement des données

# Definition du schema pour le type de message suivant
# let crypto = {
#     "name": stockObject.s,
#     "date": new Date(stockObject.E).toISOString(),
#     "value": parseFloat(stockObject.p).toFixed(2)
# }
# {"crypto":{"name":"BTCUSDT","date":"2024-01-11T13:55:14.993Z","value":"47316.66"}}

schema = StructType([
    StructField("crypto", StructType([
        StructField("name", StringType()),
        StructField("date", StringType()),
        StructField("value", StringType())
    ]))
])
# Conversion des données en dataframe
data_df = kafka_stream.selectExpr("CAST(value AS STRING)") \
                      .select(from_json("value", schema).alias("data")) \
                      .select("data.crypto.*")
# Sortie des données
query = data_df.writeStream.outputMode("append") \
    .format("console") \
    .start()

kafka_stream_write = spark.writeStream

query.awaitTermination()

