import { useParams } from 'react-router-dom';
import { getArticleById } from '../../api-functions/getArticleById';
import { useEffect, useState } from 'react';
import { ArticleComments } from '../ArticleComments';
import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { patchArticleVotes } from '../../api-functions/patchArticleVotesByArticleId';

export const SingleArticle = () => {
    const [article, setArticle] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const {article_id} = useParams();
    const [upVote, setUpVote] = useState(false);
    const [downVote, setDownVote] = useState(false);
    const [vote, setVote] = useState(0);
    const [error, setError] = useState(false);
    
    useEffect(()=>{
        getArticleById(article_id).then(({data}) =>{
            setArticle(data.article)
            setIsLoading(false);
        })
    },[])

    useEffect(()=> {
        if(vote && article.article_id && vote !== 0){
            patchArticleVotes(article.article_id, vote)
                .catch(error => {
                    setError(true);
                })
        }
    },[vote])

    const handleUpVote = () => {
         if(upVote && vote !== 0){
            setUpVote(false);
            setVote(0);
        }else if(!upVote && !downVote){
            setUpVote(true);
            setVote(1);
        }else if(downVote){
            setDownVote(false);
            setVote(0);
        }
    }
    const handleDownVote = () => {
        if(downVote && vote !== 0){
            setDownVote(false);
            setVote(0);
        }else if(!downVote && !upVote){
            setDownVote(true);
            setVote(-1);
        }else if(upVote){
            setUpVote(false);
            setVote(0);
        }
    }

    if(isLoading){
        return (
            <h1 className="loading-header">Loading...</h1>
        )
    }

    if(error){
        return (
            <h1 className="loading-header">An error has occurred...</h1>
        )
    }

    return (
        <Container sx={{textAlign: "center", mt: 5}}>
            <Typography sx={{fontSize: {xs:"30px" ,md: "40px"}}}>{article.title}</Typography>
            <Typography sx={{fontSize: "15px"}} gutterBottom>By {article.author}</Typography>
            <Divider sx={{mb: 5}} />
            <Box
            component="img"
            sx={{
              height: "auto",
              width: "100%",
              mb: 5
            }}
            src={article.article_img_url}
            ></Box>
            <Divider sx={{mb: 2}}/>
            <Typography variant='subtitle1' sx={{textAlign: "left", mb: 2}}>{article.body}</Typography>
            <Typography variant='subtitle2'>Created {article.created_at.split("T")[0]}</Typography>
            <Grid container sx={{mt: 5, justifyContent: "center"}}>
                <Grid item>
                    <Typography sx={{fontSize: "30px", mr: 2}}>{article.votes + vote}</Typography>
                </Grid>
                <Grid item>
                    {upVote ? 
                    <ThumbUpIcon sx={{fontSize: "40px", mr: 2}} onClick={handleUpVote}/> :
                    <ThumbUpOutlinedIcon sx={{fontSize: "40px", mr: 2}} onClick={handleUpVote}/> 
                }
                    
                </Grid>
                <Grid item>
                    {downVote ? <ThumbDownIcon sx={{fontSize: "40px"}} onClick={handleDownVote}/>: 
                    <ThumbDownOutlinedIcon sx={{fontSize: "40px"}} onClick={handleDownVote}/>
                    }
                </Grid>
            </Grid>
            <Divider/>
            <ArticleComments article_id={article.article_id}/>
        </Container>
    )
}