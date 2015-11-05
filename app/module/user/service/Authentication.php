<?php
namespace minikanban\app\module\user\service;

/**
 *
 * @author j
 * Date: 2/18/15
 * Time: 7:19 PM
 *
 * File: authentification.class.php
 */


use chilimatic\lib\database\sql\mysql\Tool;
use chilimatic\lib\di\ClosureFactory;
use minikanban\app\module\user\model\User;

/**
 * Class Authentication
 *
 * @package \app\service
 */
class Authentication
{
    /**
     * @var \chilimatic\lib\session\handler\Session
     */
    private $sessionHandler;


    public function __construct(\chilimatic\lib\session\handler\Session $sessionHandler){
        $this->sessionHandler = $sessionHandler;
    }

    /**
     * @param int $userId
     *
     * @return User|null
     */
    public function getUserById($userId)
    {
        if (!$userId) {
            return null;
        }

        /**
         * @var \MongoClient $db
         */
        $db = ClosureFactory::getInstance()->get('mongo');

        $userModel = $db->


            $em->findOneBy(new \minikanban\app\module\user\model\User(), [
            'id' => $userId
        ]);

        return $userModel;
    }


    /**
     * @param $username
     * @param $password
     *
     * @return null
     */
    public function getUserByUsernameAndPassword($username, $password)
    {
        if (!$username || !$password) {
            return null;
        }

        /**
         * @var \chilimatic\lib\database\mongo\odm\DocumentManager $dm
         */
        $dm = ClosureFactory::getInstance()->get('document-manager');
        $user = $dm->findOneBy('minikanban\app\module\user\model\User', ['username' => $username]);
        if ($user->getId()) {
            if (password_verify($password, $user->getPassword())) {
                $user = null;
            }
        }

        return $user;
    }

    /**
     * loads the user from session
     * we always get the user via DB abstraction
     *
     * @return bool|mixed
     */
    public function getUserFromSession() {
        if (!$this->sessionHandler->get('user')) {
            return null;
        }

        return $this->getUserById($this->sessionHandler->get('user'));
    }
}