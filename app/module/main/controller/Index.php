<?php

namespace minikanban\app\module\main\controller;

/**
 * Class Index
 * @package \minikanban\app\default\controller
 */
class Index extends Application
{

    public function indexAction(){
        $this->setView(new \chilimatic\lib\view\PHtml());
        $this->getView()->pageTitle = 'mini-kanban';
    }

}