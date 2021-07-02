"""hate_data.py
by Emma Cote
Last Update: June 7, 2021
description: Put the date in the splc hate group data for 2020 into a sqlite3 data table."""
import sqlite3
import csv
import flask
from flask import Flask, request, jsonify
import json
from bs4 import BeautifulSoup
import requests


app = Flask(__name__)


db_url = "hate_data.db"
cvs_file_name = "splc-hate-groups-2020.csv"


def get_state_populations():
    file_name = "nst-est2019-alldata.csv"
    with open(file_name) as f:
        reader = csv.reader(f)
        state_recs = [line for line in reader][1:]
        STATE, POPESTIMATE2019 = 4, 16

        # remove region and nationwide records from the beginning of the file.
        state_recs = state_recs[5:]

        state_pops = [(state_rec[STATE], state_rec[POPESTIMATE2019]) for state_rec in state_recs]

    state_pops.pop() # HACK: Puerto Rico shows up as the last record. Removing it from the list.
    state_pops = dict(state_pops)
    return state_pops


def get_most_common_hate_group(state=None):
    arg_dict = dict(state_arg=state)

    db_name = "hate_data.db"
    query = """select headquarters, count(*)
                from hate_groups as main
                where main.state = :state_arg
                group by main.headquarters
                order by count(*) desc;"""

    conn = sqlite3.connect(db_name)
    csr = conn.cursor()
    res = csr.execute(query, arg_dict)
    rec = res.fetchone()
    hate_category, category_count = rec
    return hate_category


def get_state_hate_count(state=None):

    db_name = "hate_data.db"

    query = """select count(*)
                from hate_groups
                where state = :state_arg"""

    conn = sqlite3.connect(db_name)
    csr = conn.cursor()

    res = csr.execute(query, dict(state_arg=state))
    ds = res.fetchone()
    res.close()
    csr.close()
    hate_group_total = int(list(ds)[0])
    return hate_group_total


def get_state_square_miles():
    state_miles_list = []

    wiki_url = "https://en.wikipedia.org/wiki/List_of_U.S._states_and_territories_by_area"
    res = requests.get(wiki_url)
    raw_text = res.text
    soup = BeautifulSoup(raw_text, features="html.parser")

    div_tag = soup("div", class_="mw-parser-output")[0]
    table = div_tag("table")[0]
    tbody = table("tbody")[0]
    rows = [tr for tr in tbody("tr") if len(tr("th")) > 0]
    for row in rows[2:53]:
        th = row("th")[0]
        state_name = th.text.strip()
        cells = row("td")
        land_area_str = cells[4].text
        land_area_str = land_area_str.strip().replace(",", "")
        land_area_int = float(land_area_str)
        state_miles_list.append((state_name, land_area_int, ))

    state_miles_dct = dict(state_miles_list)
    return state_miles_dct


@app.route("/hatedata")
def get_state_hate_data():
    """
    Get a set of hate data pertaining all states.
    :return: A json set of all states and their respective data.
    """
    hate_data_dict = dict()

    square_miles_dict = get_state_square_miles()
    for state, square_miles in square_miles_dict.items():
        hate_data_dict[state] = dict(miles=square_miles)

    for state, pop in get_state_populations().items():
        square_miles = square_miles_dict[state]
        hate_count = get_state_hate_count(state)
        most_common = get_most_common_hate_group(state)
        state_data = dict(square_miles=square_miles, hate_count=hate_count, most_common=most_common, pop=pop)
        hate_data_dict[state]=state_data

    return jsonify(hate_data_dict)


if __name__ == '__main__':
    app.debug=True
    app.run()
