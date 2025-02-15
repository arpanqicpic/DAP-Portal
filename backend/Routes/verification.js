// const express = require('express');
// const pool = require('../db/db');
// const { Cookie } = require('express-session');
// // Import the correct decrypt utility
// const decrypt = require('../utils/Decrypt');
// const { getImageUrl } = require('../utils/AWS_qicpic_file_converter');
// const router = express.Router();
// require('dotenv').config();

// const secretKey = process.env.ENCRYPTION_SECRET_KEY;
// const bucketName = process.env.AWS_BUCKET_NAME;
// const foldername = process.env.AWS_FOLDER_NAME


// router.get('/home', (req, res) => {
//    console.log("In home page");
//    res.status(200).json({message:"In the home page"})
// });




// // router.get('/profile', async (req, res) => {
// //     const distributor_id = 'D123';
// //     // const distributor_id = req.user 
// //     // console.log(req)
// //     try {
// //         console.log("Fetching profile data for distributor_id:", distributor_id);
// //         if (!distributor_id) {
// //             return res.status(400).json({ message: "Missing distributor_id in cookies" });
// //         }
// //         // Fetch dis_request_id from dm_onboarded_distributors
// //         const disRequestData = await pool.query(
// //             "SELECT dis_request_id FROM iris_sb_test.dm_onboarded_distributors WHERE distributor_id = $1",
// //             [distributor_id]
// //         );
// //         if (disRequestData.rows.length === 0) {
// //             return res.status(404).json({ message: "Distributor not found" });
// //         }
// //         const dis_request_id = disRequestData.rows[0].dis_request_id;
// //         console.log("Fetched dis_request_id:", dis_request_id);
// //         // Fetch all required data
// //         const [distributorDetails, invoiceAgreement, bankDetails, documentDetails] = await Promise.all([
// //             pool.query("SELECT * FROM iris_sb_test.onboard_distributor WHERE dis_request_id = $1", [dis_request_id]),
// //             pool.query("SELECT * FROM iris_sb_test.distributor_invoice_agreement_details WHERE dis_request_id = $1", [dis_request_id]),
// //             pool.query("SELECT * FROM iris_sb_test.onboard_dist_bank_payment_details WHERE dis_request_id = $1", [dis_request_id]),
// //             pool.query("SELECT * FROM iris_sb_test.onboard_dist_document_details WHERE dis_request_id = $1", [dis_request_id]),
// //         ]);
// //         if (distributorDetails.rows.length === 0) {
// //             return res.status(404).json({ message: "Distributor personal details not found" });
// //         }
// //         const distributor = distributorDetails.rows[0];
// //         const distributer_invoice = invoiceAgreement.rows[0]
// //         const distributorBankDetails = bankDetails.rows[0]
// //         const dist_documentDetails = documentDetails.rows[0];
// //         console.log(dist_documentDetails);
// //         const imageFields = [
// //           { name: 'passport_photo', label: 'passport_photo' },
// //           { name: 'pan_photo', label: 'pan_photo' },
// //           { name: 'agreement_copy_utility_bill', label: 'agreement_copy_utility_bill' },
// //           { name: 'invoice_id', label: 'invoice_id' },
// //           { name: 'agreement_id', label: 'agreement_id' },
// //           { name: 'welcome_poster_image_id', label: 'welcome_poster_image_id' },
// //           { name: 'agreement_copy_id', label: 'agreement_copy_id' },
// //         ];
// //         const imageUrls = {};
// //         for (const field of imageFields) {
// //           const fieldName = field.name;
// //           let fileName;
// //           if (['invoice_id', 'agreement_id', 'welcome_poster_image_id', 'agreement_copy_id'].includes(fieldName)) {
// //             fileName = distributer_invoice[fieldName];
// //           } else {
// //             fileName = dist_documentDetails[fieldName];
// //           }
// //           if (fileName) {
// //             try {
// //               const imageUrl = await getImageUrl(bucketName, foldername, fileName);
// //               imageUrls[field.label] = imageUrl;
// //             } catch (error) {
// //               console.error(`Error fetching URL for ${field.label}:`, error);
// //               imageUrls[field.label] = null; 
// //             }
// //           } else {
// //             imageUrls[field.label] = null; 
// //           }
// //         }
// //         // Access all the image URLs like this:
// //         const passport_photo = imageUrls.passport_photo;
// //         const pan_photo = imageUrls.pan_photo;
// //         const agreement_copy_utility_bill = imageUrls.agreement_copy_utility_bill;
// //         const invoice = imageUrls.invoice_id;  
// //         const agreement = imageUrls.agreement_id; 
// //         const welcome_poster_image = imageUrls.welcome_poster_image_id;  
// //         const agreement_copy = imageUrls.agreement_copy_id;  
        
// //         // Ensure secret key is available
// //         // const secretKey = process.env.ENCRYPTION_SECRET_KEY;
// //         if (!secretKey) {
// //             console.error("Encryption secret key is missing.");
// //             return res.status(500).json({ message: "Server configuration error" });
// //         }
// //         // Decrypt sensitive data with proper error handling
// //         let decryptedAadhar = null;
// //         let decryptedPanNumber = null;
// //         try {
// //             decryptedAadhar = decrypt(distributor.aadhar_number, secretKey);
// //             decryptedPanNumber = decrypt(distributor.pan_number, secretKey);
// //             console.log("Decrypted Aadhar:", decryptedAadhar, "Decrypted PAN:", decryptedPanNumber);
// //             decrypteAccountNumber = decrypt(distributorBankDetails.account_number,secretKey)
// //             decrypteIFSCNumber = decrypt(distributorBankDetails.ifsc_code,secretKey)
// //             console.log(decrypteAccountNumber,decryptedPanNumber);
// //         } catch (decryptError) {
// //             console.error("Error decrypting sensitive data:", decryptError.message);
// //             return res.status(500).json({ message: "Error decrypting sensitive data" });
// //         }
// //         // Prepare the profile data to send

// //         console.log(passport_photo)
// //         const profileAllData = {
// //             personalDetails: { ...distributor, aadhar_number: decryptedAadhar, pan_number: decryptedPanNumber },
// //             // invoiceAgreement: invoiceAgreement.rows[0] || null,
// //             invoiceAgreement:{...distributer_invoice,invoice_id:invoice , agreement_id:agreement,welcome_poster_image_id:welcome_poster_image,agreement_copy_id:agreement_copy},
// //             bankDetails: {...distributorBankDetails , account_number : decrypteAccountNumber , ifsc_code : decrypteIFSCNumber},
// //             // bankDetails : distributorBankDetails,
// //             documentDetails: {...dist_documentDetails,passport_photo,pan_photo,agreement_copy_utility_bill},
// //         };
// //         res.status(200).json(profileAllData);
// //     } catch (error) {
// //         console.error("Error fetching distributor data:", error);
// //         res.status(500).json({ message: "An error occurred while fetching profile data", error: error.message });
// //     }
// // });





// router.get('/verificationData', async (req, res) => {
//     const distributor_id = 'D123';
//     const sector_id = 'S001';
//     try {
//         // const query = "select * from tlmerchantlead where sector_id = $1";
//         const query = "SELECT * FROM iris_sb_test.tlmerchantlead LEFT JOIN iris_sb_test.merchantlead ON iris_sb_test.tlmerchantlead.merchant_lead_id = iris_sb_test.merchantlead.merchant_id WHERE iris_sb_test.tlmerchantlead.sector_id = $1";
//         // Execute the query using async/await
//         const distributerdata = await pool.query(query, [sector_id]);
//         // Check if data exists
//         if (distributerdata.rows.length === 0) {
//             return res.status(404).json({ message: 'Data not found' });
//         }

//         const distributorImageFields = [
//             { name: "merchant_shop_indoor_image", label: "merchant_shop_indoor_image" },
//             { name: "merchant_shop_outdoor_image", label: "merchant_shop_outdoor_image" },
//             { name: "board_image", label: "board_image" },
//             { name: "visiting_card_image", label: "visiting_card_image" },
//           ];
          
//           // Function to fetch image URLs for each merchant
//           const fetchAllMerchantImageUrls = async () => {
//             const merchants = distributerdata.rows; // Get all merchants
//             const updatedMerchants = await Promise.all(
//               merchants.map(async (merchant) => {
//                 const imageUrls = {};          
//                 for (const field of distributorImageFields) {
//                   const fieldName = field.name;
//                   let fileName = merchant[fieldName]; // Get file name for the merchant
          
//                   if (fileName) {
//                     try {
//                       imageUrls[field.label] = await getImageUrl(bucketName, foldername, fileName);
//                     } catch (error) {
//                       console.error(`Error fetching URL for ${field.label}:`, error);
//                       imageUrls[field.label] = null; // Set null if there's an error
//                     }
//                   } else {
//                     imageUrls[field.label] = null; // Set null if fileName doesn't exist
//                   }
//                 }
          
//                 return { ...merchant, imageUrls }; // Append imageUrls to merchant data
//               })
//             );
//             // console.log(updatedMerchants)
          
//             return updatedMerchants;
//           };

          
          
//           // Fetch and send response
//           fetchAllMerchantImageUrls().then((updatedMerchants) => {
//             res.status(200).json(updatedMerchants);
//           });
          


//     } catch (error) {
//         console.error("Error fetching distributor data:", error); // Log the error for debugging
//         // Send error response
//         res.status(500).json({ message: 'An error occurred while fetching distributor data', error: error.message });
//     }
// });



// router.put('/profile/profile_photo_id', async (req, res) => {
//     // Extract the profile_photo_id and distributor_id from the request body
//     const { distributor_id, profile_photo_id } = req.body;
//     // Check if both values are provided

//     if (!distributor_id || !profile_photo_id) {
//         return res.status(400).json({ message: 'distributor_id and profile_photo_id are required' });
//     }

//     try {
//         // SQL query to update the profile photo ID
//         const query = 'UPDATE iris_sb_test.distributor_details SET profile_photo_id = $1 WHERE distributor_id = $2';
//         // Execute the query
//         const result = await pool.query(query, [profile_photo_id, distributor_id]);
//         // Check if the update was successful
//         if (result.rowCount === 0) {
//             return res.status(404).json({ message: 'Distributor not found' });
//         }
//         // Respond with a success message
//         res.status(200).json({ message: 'Profile photo ID updated successfully' });
//     } catch (err) {
//         // Catch and handle any errors
//         console.error('Error updating profile photo ID:', err);
//         res.status(500).json({ message: 'Error updating profile photo ID', error: err.message });
//     }
// });



// router.patch('/verificationstatus', async (req, res) => {
//     const { merchant_lead_id, status, status_time_stamp } = req.body;

//     console.log(req.body)

//     // Log the received values for debugging
//     console.log("Received data:", { merchant_lead_id, status, status_time_stamp });

//     try {
//         const checkQuery = `
//             SELECT * 
//             FROM iris_sb_test.tlmerchantlead 
//             LEFT JOIN iris_sb_test.merchantlead 
//             ON iris_sb_test.tlmerchantlead.merchant_lead_id = iris_sb_test.merchantlead.merchant_id 
//             WHERE iris_sb_test.tlmerchantlead.merchant_lead_id = $1
//         `;
       
//         const checkResult = await pool.query(checkQuery, [merchant_lead_id]);

//         if (checkResult.rows.length > 0) {
//             const updateQuery = `
//                 UPDATE iris_sb_test.tlmerchantlead 
//                 SET status = $1, status_time_stamp = $2 
//                 WHERE merchant_lead_id = $3
//             `;

//             // Log the query parameters to verify
//             console.log("Updating with values:", { status, status_time_stamp, merchant_lead_id });

//             await pool.query(updateQuery, [status, status_time_stamp, merchant_lead_id]);

//             console.log("Timestamp updated to:", status_time_stamp);

//             res.status(200).json({ message: "Verification status updated successfully" });
//         } else {
//             res.status(404).json({ message: "Merchant lead not found" });
//         }
//     } catch (error) {
//         console.error("Error updating verification status:", error); 
//         res.status(500).json({ message: 'An error occurred while processing the verification status', error: error.message });
//     }
// });




// router.patch('/imagestatus', async (req, res) => {
//     const { merchant_lead_id, ...rest} = req.body;
//     console.log(rest);

//     const fieldName = Object.keys(rest)[0];  
//     const fieldValue = rest[fieldName];
//     console.log("I am in image verification status");

//     try {
//         // shop_outdoor_status = $2, board_image_status = $3
//         const checkQuery = `UPDATE iris_sb_test.checkimage SET ${fieldName} = $1 WHERE merchant_lead_id = $2`;
//         console.log(checkQuery)
//         const checkResult = await pool.query(checkQuery, [fieldValue, merchant_lead_id]);
        
//         res.status(200).json(checkResult);

//     } catch (error) {
//         console.error("Error updating verification status:", error); // Log the error for debugging

//         // Send error response with proper status code and error message
//         res.status(500).json({ message: 'An error occurred while processing the verification status', error: error.message });
//     }
// });





// router.post('/imagestatus', async (req, res) => {

//     const {merchant_lead_id} =req.body

//     try {
//         const checkQuery = `select * from iris_sb_test.checkimage WHERE merchant_lead_id = $1`;
//         const checkResult = await pool.query(checkQuery, [merchant_lead_id]);

//         // console.log(checkResult.rows)
        
//         res.status(200).json(checkResult.rows);

//     } catch (error) {
//         console.error("Error updating verification status:", error); // Log the error for debugging

//         // Send error response with proper status code and error message
//         res.status(500).json({ message: 'An error occurred while processing the verification status', error: error.message });
//     }
// });



// router.patch('/feedback', async (req, res) => {
//     console.log(req.body)
//     const { merchant_lead_id, feedbacks } = req.body;

//     console.log("Feedbacks:", feedbacks);

//     // Since feedbacks are already in the form we need, just return them
//     const transformedFeedbacks = { ...feedbacks };  // Directly use the feedbacks object

//     // console.log("Transformed Feedbacks:", transformedFeedbacks);
//     try {
//         // Step 1: Get current feedback for the merchant
//         const checkQuery = "SELECT feedback FROM iris_sb_test.checkimage WHERE merchant_lead_id = $1;";
//         const result = await pool.query(checkQuery, [merchant_lead_id]);

//         // Step 2: Check if feedback exists for the merchant
//         if (result.rows[0].feedback !== null) {

//             console.log("I am in updated field")
//             // Feedback exists, append new feedback object to existing array

//             const feedbackToAdd = JSON.stringify(transformedFeedbacks); // Convert feedback object to JSON string, then to JSONB

//             const updateQuery = `UPDATE iris_sb_test.checkimage SET feedback = feedback || $1::jsonb WHERE merchant_lead_id = $2 RETURNING feedback;`;

//             const updateResult = await pool.query(updateQuery, [feedbackToAdd, merchant_lead_id]);

//             // Return the updated feedback
//             res.status(200).json(updateResult.rows[0].feedback);
//         } else {

//             console.log("I am in feedback")
//             // Feedback doesn't exist, insert new feedback as an array
//             const feedbackToAdd = JSON.stringify(transformedFeedbacks); 
//             const insertQuery = `UPDATE iris_sb_test.checkimage SET feedback = $1::jsonb WHERE merchant_lead_id = $2 RETURNING feedback;`;

//             const insertResult = await pool.query(insertQuery, [feedbackToAdd, merchant_lead_id]);

//             res.status(200).json(insertResult.rows[0].feedback);
//         }

//     } catch (error) {
//         console.error("Error updating feedback:", error); // Log the error for debugging

//         // Send error response with proper status code and error message
//         res.status(500).json({ message: 'An error occurred while updating feedback', error: error.message });
//     }
// });

// module.exports = router


const express = require('express');
const pool = require('../db/db');
const { Cookie } = require('express-session');
// Import the correct decrypt utility
const decrypt = require('../utils/Decrypt');
const { getImageUrl } = require('../utils/AWS_qicpic_file_converter');
const router = express.Router();
require('dotenv').config();
const secretKey = process.env.ENCRYPTION_SECRET_KEY;


const bucketNameQicpic = process.env.AWS_BUCKET_NAME_QICPIC;
const bucketNameGOVERNMENT = process.env.AWS_BUCKET_NAME_GOVERNMENT;

router.get('/profile', async (req, res) => {
    const dis_request_id= 451
    const distributor_id= "DID0094"
    // const {dis_request_id, distributor_id} = req.body 
    try {
        // Fetch required data with error handling
        const [distributorDetails, invoiceAgreement, bankDetails] = await Promise.all([
            pool.query("SELECT * FROM iris_sb_test.distributor_details WHERE distributor_id = $1", [distributor_id]),
            pool.query("SELECT * FROM iris_sb_test.distributor_invoice_agreement_details WHERE dis_request_id = $1", [dis_request_id]),
            pool.query("SELECT * FROM iris_sb_test.onboard_dist_bank_payment_details WHERE dis_request_id = $1", [dis_request_id]),
        ]);

        // Log the query results for debugging
        console.log('Distributor Details:', distributorDetails);
        console.log('Invoice Agreement:', invoiceAgreement);
        console.log('Bank Details:', bankDetails);

        // Check if any of the queries returned no data
        if (!distributorDetails || distributorDetails.rows.length === 0) {
            return res.status(404).json({ message: "Distributor personal details not found" });
        }
        if (!invoiceAgreement || invoiceAgreement.rows.length === 0) {
            return res.status(404).json({ message: "Invoice agreement details not found" });
        }
        if (!bankDetails || bankDetails.rows.length === 0) {
            return res.status(404).json({ message: "Bank details not found" });
        }

        // Extract data from rows
        const distributor = distributorDetails.rows[0];
        const distributer_invoice = invoiceAgreement.rows[0];
        const distributorBankDetails = bankDetails.rows[0];
        
        // Log distributor to check for missing fields
        console.log('Distributor Object:', distributor);

        // Check if the fields exist in distributor object
        console.log('Profile Photo ID:', distributor.profile_photo_id);
        console.log('Authorization Certification Image ID:', distributor.authorization_certification_image_id);

        // Define the image fields with their bucket assignment
        const imageFields = [
            { name: 'profile_photo_id', label: 'profile_photo_id', bucket: bucketNameQicpic },
            { name: 'authorization_certification_image_id', label: 'authorization_certification_image_id', bucket: bucketNameGOVERNMENT },
            { name: 'invoice_id', label: 'invoice_id', bucket: bucketNameGOVERNMENT },
            { name: 'agreement_id', label: 'agreement_id', bucket: bucketNameGOVERNMENT },
            { name: 'welcome_poster_image_id', label: 'welcome_poster_image_id', bucket: bucketNameGOVERNMENT },
            { name: 'agreement_copy_id', label: 'agreement_copy_id', bucket: bucketNameGOVERNMENT },
        ];

        const imageUrls = {};
        
        for (const field of imageFields) {
            const fieldName = field.name;
            let fileName;

            if (['profile_photo_id', 'authorization_certification_image_id'].includes(fieldName)) {
                // For profile and authorization image IDs, fetch from distributor data
                fileName = distributor[fieldName];
            } else {
                // For other image fields, fetch from invoice data
                fileName = distributer_invoice[fieldName];
            }

            if (fileName) {
                try {
                    const imageUrl = await getImageUrl(field.bucket, fileName); // Use correct bucket for each field
                    imageUrls[field.label] = imageUrl;
                } catch (error) {
                    console.error(`Error fetching URL for ${field.label}:`, error);
                    imageUrls[field.label] = null; 
                }
            } else {
                imageUrls[field.label] = null; 
            }
        }


        // Build the profile data with images included
        const profileAllData = {
            distributorDetails: {...distributor,profile_photo_id : imageUrls.profile_photo_id,
                authorization_certification_image_id: imageUrls.authorization_certification_image_id
            } ,// Include distributor details
            invoiceAgreement: { 
                ...distributer_invoice, 
                invoice_id: imageUrls.invoice_id, 
                agreement_id: imageUrls.agreement_id,
                welcome_poster_image_id: imageUrls.welcome_poster_image_id, 
                agreement_copy_id: imageUrls.agreement_copy_id
            },
            bankDetails: distributorBankDetails,
        };

        res.status(200).json(profileAllData);

    } catch (error) {
        console.error("Error fetching distributor data:", error);
        res.status(500).json({ message: "An error occurred while fetching profile data", error: error.message });
    }
});




router.get('/distributor', async (req, res) => {
    const email = '12gauravthakur@gmail.com';

    try {
        const disRequestData = await pool.query(
            "SELECT dis_request_id, distributor_id FROM iris_sb_test.dm_onboarded_distributors WHERE mail_id= $1",
            [email]
        );
        return res.status(200).json(disRequestData.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching data' });
    }
});


router.put('/profile/profile_photo_id', async (req, res) => {
        const { email, profile_photo_id } = req.body;
    
        if (!email || !profile_photo_id) {
            return res.status(400).json({ message: 'email and profile_photo_id are required' });
        }
    
        try {
            const query = 'UPDATE iris_sb_test.distributor_details SET profile_photo_id = $1 WHERE email = $2';
            // Execute the query
            const result = await pool.query(query, [profile_photo_id, email]);
            // Check if the update was successful
            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Distributor not found' });
            }
            // Respond with a success message
            res.status(200).json({ message: 'Profile photo ID updated successfully' });
        } catch (err) {
            // Catch and handle any errors
            console.error('Error updating profile photo ID:', err);
            res.status(500).json({ message: 'Error updating profile photo ID', error: err.message });
        }
    });



module.exports = router
