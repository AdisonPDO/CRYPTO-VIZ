from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import StructType, StructField, StringType

# Binance Spark Streaming

# Création d'une session Spark
spark = SparkSession.builder.appName("BinanceSession").getOrCreate()
print('PySpark Version :'+spark.version)
print('PySpark Version :'+spark.sparkContext.version)
# Config de la session Spark
df = spark.readStream.format("kafka") \
    .option("kafka.bootstrap.servers", "broker:9092") \
    .option("subscribe", "datas_binance") \
    .load()

# Schéma pour parser les données JSON
schema = StructType([
    StructField("crypto", StructType([
        StructField("name", StringType(), True),
        StructField("date", StringType(), True),
        StructField("value", StringType(), True)
    ]), True)
])

# Extraction et parsing des données JSON
parsed_df = df.select(from_json(col("value").cast("string"), schema).alias("parsed_value"))

# Sélection des champs nécessaires
crypto_df = parsed_df.select(
    col("parsed_value.crypto.name").alias("name"),
    col("parsed_value.crypto.date").alias("date"),
    col("parsed_value.crypto.value").alias("value")
)

# Fonction pour traiter chaque micro-batch et envoyer les données à un autre topic Kafka
def foreach_batch_function(batch_df, epoch_id):
    # Affichage de la première ligne du micro-batch
    print("New micro-batch: ")
    batch_df.show(1, False)

    # voici la sortie du micro-batch
    # +------+-------------------+-------------------+
    # |name  |date               |value              |
    # +------+-------------------+-------------------+
    # |bitcoin|2021-10-01 12:00:00|50000              |
    # +------+-------------------+-------------------+

    #
    # Envoi des données vers un topic Kafka spécifique
    ds = batch_df.selectExpr("CAST(name AS STRING) AS key", "to_json(struct(*)) AS value") \
        .write \
        .format("kafka") \
        .option("kafka.bootstrap.servers", "broker:9092") \
        .option("topic", "datas_clean") \
        .save()

# Application de la fonction sur chaque micro-batch
query = crypto_df.writeStream \
    .foreachBatch(foreach_batch_function) \
    .outputMode("update") \
    .start()

query.awaitTermination()
