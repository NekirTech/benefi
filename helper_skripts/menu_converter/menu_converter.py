import pandas as pd
import json
import os

# Beispielaufruf der Funktion
locales="../../src/locales/"
excel_file = 'menu.xlsx'
sheet1 = 'menu'
sheet2 = 'categories'
menu_en_json = locales+'menu_en.json'
menu_tr_json = locales+'menu_tr.json'
menu_json = locales+'menu.json'
menu_static_json = locales+'menu_static.json'

def write_json(name, content):
     with open(name, 'w', encoding='utf-8') as json_file:
        json.dump(content, json_file, ensure_ascii=False, indent=4)

def excel_to_json(excel_file, sheet1, sheet2):
    # Excel-Datei lesen
    df1 = pd.read_excel(excel_file, sheet_name=sheet1)
    df2 = pd.read_excel(excel_file, sheet_name=sheet2)

    menu_content={}
    for index, row in df2.iterrows():
        category=row["category"].lower().replace(" ","_")
        sub_category=row["sub_category"].lower().replace(" ","_")
        if category not in menu_content:
          menu_content[category]={}
        menu_content[category][sub_category]=[]

    menu_en_content={}
    menu_tr_content={}
    menu_static_content={}
    for index, row in df1.iterrows():
        english_name=row['english_name']
        english_description=row['english_description']
        key_name=english_name.lower().replace(" ","_")

        #english language
        menu_en_content[key_name]={}
        if not pd.isnull(english_name):
          menu_en_content[key_name]["name"]=english_name
        if not pd.isnull(english_description):
          menu_en_content[key_name]["description"]=english_description

        #turkish language
        turkish_name=row['turkish_name']
        turkish_description=row['turkish_description']
        menu_tr_content[key_name]={}
        if not pd.isnull(turkish_name):
          menu_tr_content[key_name]["name"]=turkish_name
        if not pd.isnull(turkish_description):
          menu_tr_content[key_name]["description"]=turkish_description

        #static menu
        small_price=row['small_price']
        large_price=row['large_price']
        menu_static_content[key_name]={}
        if not pd.isnull(small_price):
          menu_static_content[key_name]["small_price"]=int(small_price)
        if not pd.isnull(large_price):
          menu_static_content[key_name]["large_price"]=int(large_price)
        picture_name=key_name+".webp"
        picture_path="../../public/menu_pics/"
        if os.path.exists(picture_path+picture_name):
          menu_static_content[key_name]["picture"]="menu_pics/"+picture_name
          print("pic found: "+picture_name)

        #menu
        product_category=row['category']
        if not pd.isnull(product_category):

          product_category_key=product_category.lower().replace(" ","_")
          for categories in menu_content:
            for subcategory in menu_content[categories]:
                if product_category_key==subcategory:
                  menu_content[categories][subcategory].append(key_name)
    #data1 = menu_en_content.to_dict(orient='records')
    # Daten als JSON-Datei speichern
    write_json(menu_en_json,menu_en_content)
    write_json(menu_tr_json,menu_tr_content)
    write_json(menu_static_json,menu_static_content)
    write_json(menu_json,menu_content)

excel_to_json(excel_file, sheet1, sheet2)
