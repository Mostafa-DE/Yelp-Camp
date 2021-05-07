const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index')

module.exports.index = async (req , res , next) => {
    const Campgrounds = await Campground.find({});
    res.render('campgrounds/index' , { Campgrounds });
};

module.exports.renderNewForm = async(req , res , next ) => {

    res.render('campgrounds/new');
}

module.exports.renderShowPage = async (req , res ) => {
    const campground = await await Campground.findById(req.params.id)
    .populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(campground);
    if(!campground){
        req.flash('error' , 'The Campground You Looking For Not Found!!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show' , { campground });
}

module.exports.renderEditForm = async (req , res ,next ) => {
    const { id } = req.params;
    const campground = await Campground.findById(id); 
    if(!campground){
        req.flash('error' , 'The Campground You Looking For Not Found!!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit' , { campground });
}

module.exports.createNewCamp = async (req , res, next ) => {// show product that you Create}
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url:f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success' , 'You Successfully Made A New Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.updateCamp = async (req , res, next ) => { // put the change in your database
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground});
    const imgs = req.files.map(f => ({ url:f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images:{ filename:{ $in: req.body.deleteImages } } } })
    }
    req.flash('success' , 'You Successfully Update The Campground!!');
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send("it worked!!!!")

}

module.exports.deleteCamp = async (req , res , next ) => {
    const { id } = req.params;
    const campgroundDelete = await Campground.findByIdAndDelete(id);
    req.flash('success' , 'You Successfully Delete The Campground!!');
    res.redirect('/campgrounds'); 
}
