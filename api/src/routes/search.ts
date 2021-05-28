import express from 'express'
import { search } from '../controllers/search'
import router from './auth'

router.post('/search', express.urlencoded({ extended: true }), express.json(), search)