#!/bin/bash

DB_NAME="keeratxyz"
URI="mongodb://localhost:27017"
OUTPUT_DIR="./mongo_json_backup"

mkdir -p "$OUTPUT_DIR"

# Get all collection names
# collections=$(mongosh "mongodb://localhost:27017/keeratxyz" --quiet --eval "db.getCollectionNames().join('\n')")
collections=$(mongosh "$URI/$DB_NAME" --quiet --eval "db.getCollectionNames().join('\n')")

for collection in $collections; do
  echo "Exporting $collection..."

  RAW_FILE="$OUTPUT_DIR/${collection}_raw.json"
  CLEAN_FILE="$OUTPUT_DIR/${collection}.json"

  mongoexport \
    --uri="$URI" \
    --db="$DB_NAME" \
    --collection="$collection" \
    --out="$RAW_FILE" \
    --type=json



  # Remove all _id and __v fields at any depth
  jq 'walk(if type == "object" then del(._id, .__v) else . end)' "$RAW_FILE" > "$CLEAN_FILE"
  rm "$RAW_FILE"
  echo "✅ $collection exported to $CLEAN_FILE"
done

echo "✅ All collections exported to $OUTPUT_DIR"

