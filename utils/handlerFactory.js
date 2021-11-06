const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./apiFeatures');

const filterObj = (obj, ...restrictedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (!restrictedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getId = params => {
  if (params.logId) return params.logId;
  if (params.noteId) return params.noteId;
};

exports.getAllForSheet = Model =>
  catchAsync(async (req, res, next) => {
    // Execute the query
    // req.sheet comes from sheetController.checkSheetExists
    const features = new APIFeatures(Model.find({ sheetId: req.sheet.id }), req.query).filter().sort().limitFields().paginate();

    const docs = await features.query; // features.query.explain() - gives me all the info on the query

    // Send the response
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs,
      },
    });
  });

exports.createOneForSheet = Model =>
  catchAsync(async (req, res, next) => {
    // Set the documents sheetId
    // req.sheet comes from sheetController.checkSheetExists
    req.body.sheetId = req.sheet.id;

    // Create the document
    const newDoc = await Model.create(req.body);

    // Send the response
    res.status(201).json({
      status: 'success',
      data: {
        doc: newDoc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // Get the id from params
    const docId = getId(req.params);

    // Find document
    let query = Model.findById(req.params.id);

    // Populate document, if populate options were provided
    if (populateOptions) query = query.populate(populateOptions);

    // Execute the query
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No document found with id ${docId}`, 404));
    }

    // Send the response
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Model, restrictedFields) =>
  catchAsync(async (req, res, next) => {
    // Get the id from params
    const docId = getId(req.params);

    if (!restrictedFields) restrictedFields = [];

    // Specify specific fields NOT allowed to be updated
    const filteredBody = filterObj(req.body, ...restrictedFields);

    // Execute the query
    const doc = await Model.findByIdAndUpdate(docId, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No document found with id ${docId}`, 404));
    }

    // Send the response
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    // Get the id from params
    const docId = getId(req.params);

    // Execute the query
    const doc = await Model.findByIdAndDelete(docId);

    if (!doc) {
      return next(new AppError(`No document found with id ${docId}`, 404));
    }

    // Send the response
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
