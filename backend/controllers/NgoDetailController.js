//this code serve to user authentication system

import NgoModel from '../models/NgoModel.js'


//this function take the user id that given by mongo and generate a token for it and return it

const NgoDetail = async (req, res) => {

    const location = req.body.location;

    try {

        // build filter dynamically
        let filter = {};

        if (location && location.trim() !== "") {
            filter.location = { $regex: location, $options: "i" };
            // case-insensitive match
        }

        const ngos = await NgoModel
            .find(filter)
            .sort({ createdAt: -1 }); // change field name if needed

        res.json({
            success: true,
            count: ngos.length,
            data: ngos
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error fetching NGOs"
        });

    }

};

export { NgoDetail}