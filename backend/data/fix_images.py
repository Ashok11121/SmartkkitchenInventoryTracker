import json
import urllib.parse

# 1. Load your existing JSON file
input_filename = 'products.json'
output_filename = 'smartkitchen_real_images.json'

try:
    with open(input_filename, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Loaded {len(data)} items. Fetching real image links...")

    # 2. Loop through each item and create a "Search" URL
    for item in data:
        # Get the product name safely
        product_name = item.get('name', '')
        
        if not product_name:
            # Fallback if name is missing
            product_name = item.get('category', 'grocery')

        # Clean the name: remove special characters that might break the link
        # We take the first 4 words to make the search specific but not too long
        search_terms = " ".join(str(product_name).split()[:4])
        
        # URL Encode the name (e.g., "Green Apple" becomes "Green%20Apple")
        encoded_name = urllib.parse.quote(search_terms)
        
        # This URL tells Bing: "Give me a 300x300 thumbnail image for this search term"
        # w=300, h=300 sets size. c=7 means "crop to fill".
        new_url = f"https://tse2.mm.bing.net/th?q={encoded_name}&w=300&h=300&c=7"
        
        item['image_url'] = new_url

    # 3. Save the new JSON file
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

    print(f"✅ Success! Created '{output_filename}'.")
    print("These links will load REAL photos for each product.")

except FileNotFoundError:
    print(f"❌ Error: Could not find '{input_filename}'.")
except Exception as e:
    print(f"❌ An unexpected error occurred: {e}")