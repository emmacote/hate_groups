import sqlite3
import csv

db_url = "hate_data.db"
cvs_file_name = "splc-hate-groups-2020.csv"

def create_database():
    # NOTE: Yes I'm being lazy and dumb and not bothering with the primary key because I'm just feeling too
    # indifferent to care at the moment.
    make_table_sql = """create table hate_groups(title text, 
                                                     city text, 
                                                     state text, 
                                                     group_name text, 
                                                     headquarters text, 
                                                     statewide text, 
                                                     year text)"""


    conn = sqlite3.connect(db_url)
    csr = conn.cursor()
    res = csr.execute(make_table_sql)
    print("sql execution for table creation done.")


def populate_db():
    file_ob = open(cvs_file_name, newline="")
    reader = csv.reader(file_ob)
    hate_groups = [line for line in reader][1:]

    conn = sqlite3.connect(db_url)

    for hate_group in hate_groups:
        data_rec = dict(title=hate_group[0], city=hate_group[1], state=hate_group[2], group_name=hate_group[3],
                        headquarters=hate_group[4], statewide=hate_group[5], year=hate_group[6])
        csr = conn.cursor()
        insert_query = "insert into hate_groups values(:title, :city, :state, :group_name, :headquarters, :statewide, :year)"
        csr.execute(insert_query, data_rec)
    conn.commit()

    print("done storing hate group data. check database...")


if __name__ == '__main__':
    pass