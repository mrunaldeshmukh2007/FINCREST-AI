import kagglehub
import os

output_dir = os.path.join(
    os.path.dirname(__file__),
    "data"
)

path = kagglehub.dataset_download(
    "artemkabasev/financial-transactions-dataset-expenses-and-income",
    output_dir=output_dir
)

print("Dataset downloaded to:")
print(path)