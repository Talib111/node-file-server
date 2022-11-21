// import { createConnection } from 'mysql';

// var con = createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "db_ranchi"
// });

// con.connect(function (err) {
//     if (err) throw err;
//     con.query("SELECT * FROM raw_prop_dtl order by id asc limit 10", function (err, result, fields) {
//         if (err) throw err;
//         // console.log(result);
//         result.map((data, index) => {
//             con.query(`INSERT INTO tbl_consumer (
//                 ward_no,  
//                 name, 
//                 police_station, 
//                 house_no, 
//                 holding_no, 
//                 mobile_no, 
//                 landmark, 
//                 address, 
//                 consumer_category_id, 
//                 consumer_type_id, 
//                 owner_id, 
//                 consumer_no, 
//                 old_consumer_no, 
//                 upload_status, 
//                 created_by, 
//                 transaction_no, 
//                 paid_amount, 
//                 payment_date, 
//                 payment_mode, 
//                 payment_from, 
//                 payment_to, 
//                 con_type, 
//                 pincode, 
//                 locality, 
//                 user_id, 
//                 entry_type, 
//                 deactivate_status, 
//                 apt_code, 
//                 apt_mstr_id,
//                 date_time,
//                 creation_date,
//                 entry_date
//                 ) VALUES (
//                     '${data.new_ward_mstr_id}', 
//                     '', 
//                     '', 
//                     '', 
//                     '${data.new_ward_mstr_id}',
//                     '', 
//                     '', 
//                     '${data.new_ward_mstr_id}',
//                      '', 
//                     '', 
//                     '', 
//                     '', 
//                     '', 
//                     0, 
//                     1, 
//                     '', 
//                     '', 
//                     '', 
//                     '', 
//                     '', 
//                     '', 
//                     1, 
//                     '${data.new_ward_mstr_id}', 
//                     '', 
//                     1, 
//                     1, 
//                     0, 
//                     '', 
//                     '${data.apartment_details_id}',
//                     '05-10-2022',
//                     '05-10-2022',
//                     '05-10-2022'
//                     )`, function (err, result, fields) {
//                 if (err) throw err;
//                 console.log(index+1, ' inserted successfully--')
//             });
//         })

//     });
// });


import { createConnection } from 'mysql';

var con = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_ranchi"
});

con.connect(function (err) {
    if (err) throw err;

    //1 getting all data at once
    con.query("SELECT * FROM raw_prop_dtl order by id", function (err, result, fields) {
        // con.query("SELECT * FROM `raw_prop_dtl` where apt_mstr_id != 0 order by id asc limit 10", function (err, result, fields) {
        if (err) throw err;

        result.map((data, index) => {
            var consumerNoGenerated

            const updateConsumerNo = (consumerNoGenerated) => {
                // console.log(index, ' consumer no is ...', consumerNoGenerated)

                // 3 updating with consuemr no
                con.query(`update raw_prop_dtl set consumer_no='${consumerNoGenerated}' where id=${data.id}`, function (err, result2, fields) {
                    if (err) throw err;
                    console.log(index, 'consumer no inserted success in id ....', data.id)
                });
            }

            if (data.apartment_details_id == 0) {
                let serialNo = "0001"
                let wardCreated = `${data.ward_no}`.padStart(2, "0")
                // let consumerTypeCreated = `${data.consumer_type_id}`.padStart(2, "0")
                let idCreated = `${data.id}`.padStart(5, "0")
                consumerNoGenerated = `${wardCreated}104${idCreated}${serialNo}`
                updateConsumerNo(consumerNoGenerated)
            } else {
                // 2 count if apt id exist
                // con.query(`SELECT COUNT(id) as flatCount FROM tbl_consumer where apt_mstr_id=${data.apt_mstr_id}`, function (err, result2, fields) {
                con.query(`SELECT count(*) as aptSerialCount  FROM raw_prop_dtl where id<${data.id} and apartment_details_id=${data.apartment_details_id}`, function (err, result2, fields) {
                    if (err) throw err;

                    result2.map((aptCount) => {
                        // console.log('....rr...', aptCount.aptSerialCount)
                        let nextSerial = aptCount.aptSerialCount + 1
                        // console.log('next serial....', nextSerial)
                        // return
                        let serialNo = `${nextSerial}`.padStart(4, "0")
                        let wardCreated = `${data.ward_no}`.padStart(2, "0")
                        // let consumerTypeCreated = `${data.consumer_type_id}`.padStart(2, "0")
                        let idCreated = `${data.id}`.padStart(5, "0")
                        consumerNoGenerated = `${wardCreated}104${idCreated}${serialNo}`
                        updateConsumerNo(consumerNoGenerated)
                    })


                });
            }






        })



    });
});
