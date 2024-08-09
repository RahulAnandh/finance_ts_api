
CREATE TABLE tb_bank(id SERIAL PRIMARY KEY,ifsc TEXT ,acc_no TEXT,bank_name TEXT,branch TEXT,acc_hol TEXT,acc_type TEXT,town TEXT,city TEXT,district TEXT,bank_state TEXT,is_deleted BOOLEAN DEFAULT false);

CREATE TABLE tb_finance(id SERIAL,finance_id TEXT PRIMARY KEY,town TEXT,city TEXT,district TEXT,state TEXT,is_deleted BOOLEAN DEFAULT false);

CREATE TABLE tb_user(id SERIAL,user_name TEXT PRIMARY KEY,password TEXT,is_deleted BOOLEAN DEFAULT false);

INSERT INTO tb_user(user_name,password)VALUES('rahul','rahul'),('rahul1','rahul1'),('8921970340','');

